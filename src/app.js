const express = require("express");
const cors = require("cors");
const config = require("./config/config");
const PORT = config.PORT;
require("./config/db");

const painAreaRouting = require("./routers/painArea");
const painDefinitionRouting = require("./routers/painDefinition");
const painBehaviorRouting = require("./routers/painBehavior");
const questionRouting = require("./routers/question");
const diagnosticsRouting = require("./routers/diagnostics");
const painBehaviorQuestionRouting = require("./routers/painBehaviorQuestion");
const painPossibleQuestionRouting = require("./routers/painPossibleDiagnotics");
const probabilityRouting = require("./routers/probability");
const assignResultRouting = require("./routers/assginResult");
const diagResultRouting = require("./routers/daignonsisResult");

const app = express();
app.use(cors());
app.use(express.json());
app.use([
  painAreaRouting,
  painDefinitionRouting,
  painBehaviorRouting,
  questionRouting,
  diagnosticsRouting,
  painBehaviorQuestionRouting,
  painPossibleQuestionRouting,
  probabilityRouting,
  assignResultRouting,
  diagResultRouting,
]);

app.listen(PORT, () => {
  console.log(`Server is running at port no ${PORT}`);
});
