import React from 'react'
import './Preview.css'

function Preview({Data}) {
  if(!Data) return null;

  return  (
     <div className="preview-box">
            {/* TABLE PREVIEW (FIXED WRAPPER ADDED) */}
            {Data?.type === "table" && (
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                {Object.keys(Data.data[0] || {}).map((k) => (
                                    <th key={k}>{k}</th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {Data.data.map((row, i) => (
                                <tr key={i}>
                                    {Object.values(row).map((v, j) => (
                                        <td key={j}>{String(v)}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* IMAGE PREVIEW */}
            {Data?.type === "images" && (
                <div className="image-grid">
                    {Data.data.map((img, i) => (
                        <div className="image-card" key={i}>
                            <img src={img} alt="" />
                        </div>
                    ))}
                </div>
            )}

            {/* TEXT PREVIEW */}
            {Data?.type === "text" && (
                <pre>{Data.data}</pre>
            )}
        </div>
  ) 
 
}

export default Preview