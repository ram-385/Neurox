import React, { useState } from "react";
import "./upload.css";

import { useNavigate } from "react-router-dom";

import JSZip from "jszip";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { XMLParser } from "fast-xml-parser";
import Preview from "./Preview";

// images
import Csv from "../../assets/upload-assets/csv.png";
import Json from "../../assets/upload-assets/json.png";
import Xml from "../../assets/upload-assets/xml.png";
import Text from "../../assets/upload-assets/text.png";
import Img from "../../assets/upload-assets/img.png";
import Excel from "../../assets/upload-assets/excel.jpg";
import upload from "../../assets/landing-assets/upload.jpg";

function Upload() {
  const [selected, setSelected] = useState("");
  const [fileInfo, setFileInfo] = useState(null);
  const [previewData, setPreviewData] = useState(null);
 const [file, setFile] = useState(null);

  // upload data to backend for further exploration task 
  const navigate = useNavigate();

  const uploadToBackend = async () => {
    if (!file) {
      alert("No file selected");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://127.0.0.1:8000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      // store response
      localStorage.setItem("dataset_id", data.dataset_id);
      localStorage.setItem("columns", JSON.stringify(data.columns));
      localStorage.setItem("Data", JSON.stringify(data.Data));

      //  navigate after  upload
      navigate("/Explore");

    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };



  const fileTypes = {
    csv: { ext: ".csv", icon: Csv },
    excel: { ext: ".xls,.xlsx", icon: Excel },
    json: { ext: ".json", icon: Json },
    xml: { ext: ".xml", icon: Xml },
    text: { ext: ".txt", icon: Text },
    img: { ext: ".zip", icon: Img },
  };

  const flattenObject = (obj, prefix = "") => {
    let result = {};
    for (let key in obj) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        Object.assign(result, flattenObject(value, newKey));
      } else {
        result[newKey] = value;
      }
    }
    return result;
  };

  const handleFile = async (e) => {
     const selectedFile = e.target.files[0];
     if (!selectedFile) return;

     setFile(selectedFile);  

    if (!selected) {
      alert("Please select dataset type first");
      return;
    }

    try {
      // IMAGE ZIP
      if (selected === "img") {
        if (!selectedFile.name.toLowerCase().endsWith(".zip")) {
          alert("Only ZIP file allowed for image dataset");
          return;
        }

        const zip = await JSZip.loadAsync(selectedFile);
        const imageFiles = [];

        Object.values(zip.files).forEach((entry) => {
          if (
            !entry.dir &&
            /\.(jpg|jpeg|png|gif|bmp|tiff)$/i.test(entry.name)
          ) {
            imageFiles.push(entry);
          }
        });

        if (imageFiles.length === 0) {
          alert("No image files found in ZIP");
          return;
        }

        const imageUrls = [];

        await Promise.all(
          imageFiles.map(async (entry) => {
            const blob = await entry.async("blob");
            const url = URL.createObjectURL(blob);
            imageUrls.push(url);
          })
        );

        setFileInfo({
          name: selectedFile.name,
          type: "Image ZIP",
          size: (selectedFile.size / 1024).toFixed(2) + " KB",
          fileCount: imageFiles.length,
        });

        setPreviewData({
          type: "images",
          data: imageUrls,
        });

        return;
      }


      const allowed = selected ? fileTypes[selected].ext : "";
      const regex = new RegExp(allowed.replace(/,/g, "|"), "i");

      if (!regex.test(selectedFile.name)) {
        alert("Wrong file type selected");
        return;
      }

      setFileInfo({
        name: selectedFile.name,
        type: selected,
        size: (selectedFile.size / 1024).toFixed(2) + " KB",
        fileCount: 1,
      });

      // CSV
      if (selected === "csv") {
        Papa.parse(selectedFile, {
          header: true,
          complete: (result) => {
            const cleanData = result.data.filter(
              (row) => Object.keys(row).length > 0
            );

            setPreviewData({
              type: "table",
              data: cleanData,
            });
          },
        });
      }

      // EXCEL
      if (selected === "excel") {
        const reader = new FileReader();

        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });

          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(sheet);

          setPreviewData({
            type: "table",
            data: json,
          });
        };

        reader.readAsArrayBuffer(selectedFile);
      }

      // JSON
      if (selected === "json") {
        const reader = new FileReader();

        reader.onload = (e) => {
          let json = JSON.parse(e.target.result);
          let data = [];

          if (Array.isArray(json)) {
            data = json.map((item) => flattenObject(item));
          } else {
            data = [flattenObject(json)];
          }

          setPreviewData({
            type: "table",
            data: data,
          });
        };

        reader.readAsText(selectedFile);
      }

      // XML
      if (selected === "xml") {
        const reader = new FileReader();

        reader.onload = (e) => {
          const parser = new XMLParser();
          const jsonObj = parser.parse(e.target.result);

          const firstKey = Object.keys(jsonObj)[0];
          let data = jsonObj[firstKey];

          if (!Array.isArray(data)) data = [data];

          data = data.map((item) => flattenObject(item));

          setPreviewData({
            type: "table",
            data: data,
          });
        };

        reader.readAsText(selectedFile);
      }

      // TEXT
      if (selected === "text") {
        const reader = new FileReader();

        reader.onload = (e) => {
          setPreviewData({
            type: "text",
            data: e.target.result,
          });
        };

        reader.readAsText(selectedFile);
      }
    } catch (error) {
      console.error(error);
      alert("Error processing file");
    }
  };

  return (
    <div className="upload-page">

      {/* DATASET CARDS */}
      <div className="dataset-section">
        <h3>1. Select Dataset Type</h3>
        <p>Choose the format of your dataset file</p>

        <div className="dataset-grid">
          {Object.keys(fileTypes).map((key) => (
            <label
              key={key}
              className={`dataset-card ${selected === key ? "active" : ""
                }`}
            >
              <input
                type="radio"
                name="dataset"
                value={key}
                checked={selected === key}
                onChange={(e) => setSelected(e.target.value)}
              />

              <div className="icon">
                <img src={fileTypes[key].icon} alt={key} />
              </div>

              <h4>{key.toUpperCase()}</h4>
              <p>File format</p>
            </label>
          ))}
        </div>
      </div>

      {/* UPLOAD BOX */}
      <div className="upload-section">
        
        <label className="upload-box">
          <input
            type="file"
            accept={selected ? fileTypes[selected].ext : "*"}
            onChange={handleFile}
          />

          <div className="upload-content">
            <div className="upload-icon">
              <img src = {upload} alt = 'upload icon'/>
            </div>
    
            <span>click to browse</span>
          </div>
        </label>
      </div>

      {/* FILE INFO */}
      {fileInfo && (
        <div className="file-info-box">
          <h3>Dataset Details</h3>
          <p>Name: {fileInfo.name}</p>
          <p>Type: {fileInfo.type}</p>
          <p>Size: {fileInfo.size}</p>
          <p>Files: {fileInfo.fileCount}</p>
        </div>
      )}

      {/* PREVIEW */}
      <Preview Data={previewData} style={{width:'100%'}} />

      {/* BUTTON */}
      <div className="start-container">
        {previewData ? (
          <button className="start-btn" onClick={uploadToBackend}>
            Start Exploration
          </button>
        ) : (
          <span className="start-btn disabled">
            Start Exploration
          </span>
        )}
      </div>
    </div>
  );
}

export default Upload;