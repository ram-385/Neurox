class BaseModel:

    def train(self, X_train, y_train, task):
        raise NotImplementedError

    def predict(self, model, X_test):
        raise NotImplementedError

    def feature_importance(self, model, columns):
        return None