import React from "react";
import {
  Answer,
  ConfigurationContext,
  FormUtils,
  Question,
} from "@kbss-cvut/s-forms";
import PropTypes from "prop-types";
import classNames from "classnames";
import SimpleTreeTypeaheadAnswer from "./SimpleTreeTypeaheadAnswer";

export default class SimpleTreeTypeaheadQuestion extends Question {
  static mappingRule = (q) => FormUtils.isTypeahead(q);

  constructor(props) {
    super(props);
  }

  _renderAnswer(index, answer) {
    const question = this.props.question;

    let component = Answer;

    if (SimpleTreeTypeaheadAnswer.mappingRule(question)) {
      component = SimpleTreeTypeaheadAnswer;
    }

    return React.createElement(component, {
      index: index,
      answer: answer,
      question: question,
      onChange: this.handleAnswerChange,
      onCommentChange: this.handleCommentChange,
      showIcon: this.state.showIcon,
      onSubChange: this.onSubQuestionChange,
    });
  }

  renderAnswers() {
    const question = this.props.question,
      children = [],
      answers = this._getAnswers();
    let cls;
    let isTextarea;

    for (let i = 0, len = answers.length; i < len; i++) {
      isTextarea =
        FormUtils.isTextarea(question, FormUtils.resolveValue(answers[i])) ||
        FormUtils.isSparqlInput(question) ||
        FormUtils.isTurtleInput(question);
      cls = classNames(
        "answer",
        Question._getQuestionCategoryClass(question),
        Question.getEmphasizedOnRelevantClass(question)
      );
      children.push(
        <div
          key={"row-item-" + i}
          className={cls}
          id={question["@id"]}
          onMouseEnter={this._onMouseEnterHandler}
          onMouseLeave={this._onMouseLeaveHandler}
        >
          <div className="answer-content" style={this._getAnswerWidthStyle()}>
            {this._renderAnswer(i, answers[i])}
          </div>
          {this._renderUnits()}
          {this._renderPrefixes()}
        </div>
      );
    }
    return children;
  }
}

SimpleTreeTypeaheadQuestion.contextType = ConfigurationContext;

SimpleTreeTypeaheadQuestion.propTypes = {
  index: PropTypes.number.isRequired,
  answer: PropTypes.object.isRequired,
  question: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onCommentChange: PropTypes.func.isRequired,
};
