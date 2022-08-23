import React from 'react';
import {Form} from 'react-bootstrap';
import JsonLdUtils from 'jsonld-utils';
import {Question, Constants as SConstants, ConfigurationContext, QuestionStatic} from '@kbss-cvut/s-forms';
import Constants from "../Constants";
import JsonldUtils from 'jsonld-utils';
import Utils from "../Utils";

export default class ShowAdvancedSwitch extends Question {

  static mappingRule = q => Utils.hasSubQuestionWithValue(q, Constants.SHOW_ADVANCED_QUESTION, true);

  static findShowAdvancedQuestion(parent) {

    let subQuestions = parent[SConstants.HAS_SUBQUESTION];
    if (subQuestions && subQuestions.length) {
      for (let i = 0; i < subQuestions.length; i++) {
        if (JsonLdUtils.hasValue(subQuestions[i], Constants.SHOW_ADVANCED_QUESTION, true)) {
          return {index: i, question: subQuestions[i]};
        }
      }
    }

    return null;
  }

  static isShowAdvanced(question) {

    let value = false;

    if (question[SConstants.HAS_ANSWER] && question[SConstants.HAS_ANSWER].length) {
      let answer = question[SConstants.HAS_ANSWER][0];
      if (answer[SConstants.HAS_DATA_VALUE]) {
        value = !!answer[SConstants.HAS_DATA_VALUE]['@value'];
      }
    }

    return value;
  }

  constructor(props) {
    super(props);
  }

  onSubQuestionChange = (subQuestionIndex, change) => {
    this._onChange(SConstants.HAS_SUBQUESTION, subQuestionIndex, change);
  };

  _getShowAdvancedQuestion() {
    return ShowAdvancedSwitch.findShowAdvancedQuestion(this.props.question);
  }

  _getShowAdvancedState() {
    let {question} = this._getShowAdvancedQuestion();
    return ShowAdvancedSwitch.isShowAdvanced(question);
  }

  _toggleAdvanced = (e) => {
    e.stopPropagation();

    let {index, question} = this._getShowAdvancedQuestion();

    let value = this._getShowAdvancedState();

    question[SConstants.HAS_ANSWER] = [{}];
    question[SConstants.HAS_ANSWER][0][SConstants.HAS_DATA_VALUE] = {'@value': !value}
    question[SConstants.HAS_VALID_ANSWER] = true;

    this._handleChange(SConstants.HAS_SUBQUESTION, index, question);
  };

  _renderIcons() {
    const options = this.context.options;
    const icons = options.icons.filter(i => i.id !== SConstants.ICONS.QUESTION_COMMENTS)
    // question comment icons are not implemented (see https://github.com/kbss-cvut/s-forms-components/issues/4)
    const optionsWithoutQuestionCommentsIcon = {...options, icons};

    const {question} = this._getShowAdvancedQuestion();
    return QuestionStatic.renderIcons(question, options, this.handleCommentChange, this.state.showIcon);
  }

  _renderSwitch() {

    const question = this.props.question;
    const showAdvancedQuestion = this._getShowAdvancedQuestion(question).question;
    const advancedQuestionLabel = JsonldUtils.getLocalized(showAdvancedQuestion[SConstants.RDFS_LABEL], this.context.options.intl);
    const switchState = this._getShowAdvancedState();

    return (
      <div className="show-advanced-switch" style={{float: 'right'}}>
        <Form.Switch
          onChange={this._toggleAdvanced}
          id={'--switch-' + showAdvancedQuestion['@id']}
          label={advancedQuestionLabel}
          checked={switchState}
          inline
        />

        {this._renderIcons()}
      </div>
    )
  }

  render() {
    return this._renderSwitch();
  }
}

ShowAdvancedSwitch.contextType = ConfigurationContext;
