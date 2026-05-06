from sklearn.linear_model import LinearRegression,LogisticRegression
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.naive_bayes import GaussianNB
from .base import BaseModel

class LinearRegressionModel(BaseModel):

    def train(self, X_train, y_train, task):
        model = LinearRegression()
        model.fit(X_train, y_train)
        return model

    def predict(self, model, X_test):
        return model.predict(X_test)

    def feature_importance(self, model, columns):
        return dict(zip(columns, model.coef_))


class LogisticRegressionModel(BaseModel):

    def train(self, X_train, y_train, task):
        model = LogisticRegression(max_iter=1000)
        model.fit(X_train, y_train)
        return model

    def predict(self, model, X_test):
        return model.predict(X_test)

    def feature_importance(self, model, columns):
        if model.coef_.ndim > 1:
            return dict(zip(columns, model.coef_[0]))
        return dict(zip(columns, model.coef_))


class DecisionTreeModel(BaseModel):

    def train(self, X_train, y_train, task):
        if task == "classification":
            model = DecisionTreeClassifier()
        else:
            model = DecisionTreeRegressor()

        model.fit(X_train, y_train)
        return model

    def predict(self, model, X_test):
        return model.predict(X_test)

    def feature_importance(self, model, columns):
        return dict(zip(columns, model.feature_importances_))


class RandomForestModel(BaseModel):

    def train(self, X_train, y_train, task):
        if task == "classification":
            model = RandomForestClassifier()
        else:
            model = RandomForestRegressor()

        model.fit(X_train, y_train)
        return model

    def predict(self, model, X_test):
        return model.predict(X_test)

    def feature_importance(self, model, columns):
        return dict(zip(columns, model.feature_importances_))
    

class NaiveBayesModel(BaseModel):

    def train(self, X_train, y_train, task):
        model = GaussianNB()
        model.fit(X_train, y_train)
        return model

    def predict(self, model, X_test):
        return model.predict(X_test)

    def feature_importance(self, model, columns):
        return None
    

MODEL_REGISTRY = {
    "linear_regression": LinearRegressionModel(),
    "logistic_regression": LogisticRegressionModel(),
    "decision_tree": DecisionTreeModel(),
    "random_forest": RandomForestModel(),
    "naive_bayes": NaiveBayesModel(),
}