import React from "react";
import { Form, FormGroup } from "react-bootstrap";
import JsonLdUtils from "jsonld-utils";
import {
  QuestionStatic,
  Constants as SConstants,
  ConfigurationContext,
} from "@kbss-cvut/s-forms";
import Constants from "../Constants";
import PropTypes from "prop-types";
import { IntelligentTreeSelect } from "intelligent-tree-select";
import Utils from "../Utils";

export default class TypeQuestionAnswer extends React.Component {
  static mappingRule = (q) =>
    JsonLdUtils.hasValue(
      q,
      SConstants.LAYOUT_CLASS,
      Constants.LAYOUT_TYPE_QUESTION
    );

  constructor(props) {
    super(props);

    this.state = {
      // tree: [
      //   {id: '1', value: '1', label: 'One', children: ['1-1', '1-2']},
      //   {id: '1-1', value: '1-1', label: 'One One', children: []},
      //   {id: '1-2', value: '1-2', label: 'One Two', children: []},
      //   {id: '2', value: '2', label: 'Two', children: []},
      // ],
      tree: {},
      optionsList: [],
      selected: [],
      singleSelect: false,
    };
  }

  _handleChange = (value) => {
    if (!value) {
      value = [];
    }

    if (value.length === undefined) {
      value = [value];
    }

    this._setAnswers(value);

    const change = { ...this.props.answer };

    change[SConstants.HAS_DATA_VALUE] = {
      "@value": !!(value && value.length),
    };

    if (!this.state.singleSelect) {
      this.setState({
        tree: this._checkDisjointOptions(this.state.tree, value),
      });
    }

    this.setState({
      selected: value,
    });

    this.props.onChange(this.props.index, change);
  };

  _setAnswers(answers) {
    let typeQuestions = this._findTypeQuestions();

    for (let i = 0; i < typeQuestions.length; i++) {
      const typeQuestion = typeQuestions[i].question;
      const answer = answers[i];

      if (answer) {
        typeQuestion[SConstants.HAS_ANSWER] = [
          {
            [SConstants.HAS_OBJECT_VALUE]: {
              "@id": answer.value,
            },
          },
        ];
      } else {
        typeQuestion[SConstants.HAS_ANSWER] = [];
      }

      this.props.onSubChange(typeQuestions[i].index, typeQuestion);
    }
  }

  _loadAnswers(options) {
    let values = [];
    let typeQuestions = this._findTypeQuestions();

    for (let typeQuestion of typeQuestions) {
      let question = typeQuestion.question;
      let answer = question[SConstants.HAS_ANSWER];
      if (answer && answer.length) {
        answer = answer[0];

        if (answer[SConstants.HAS_DATA_VALUE]) {
          values.push(answer[SConstants.HAS_DATA_VALUE]["@value"]);
        }
      }
    }

    return values.map((id) => options[id]).filter((v) => !!v);
  }

  _findTypeQuestions() {
    const question = this.props.question;
    const ids = Utils.getJsonAttValues(
      question,
      Constants.HAS_TYPE_QUESTION,
      "@id"
    );
    const subQuestions = question[SConstants.HAS_SUBQUESTION];
    const typeQuestions = [];

    for (let i = 0; i < subQuestions.length; i++) {
      const subQuestion = subQuestions[i];
      if (ids.includes(subQuestion["@id"])) {
        typeQuestions.push({
          index: i,
          question: subQuestion,
        });
      }
    }

    return typeQuestions;
  }

  _getMaxNumberOfAnswers() {
    const question = this.props.question;
    const typeQuestions = question[Constants.HAS_TYPE_QUESTION];
    if (!typeQuestions) {
      return 0;
    }

    if (Array.isArray(typeQuestions)) {
      return typeQuestions.length;
    }

    return 1;
  }

  _checkMaxNumberOfAnswers(tree, selected) {
    const maxAnswerCount = this._getMaxNumberOfAnswers();

    selected = selected.map((o) => o.value);

    if (selected.length >= maxAnswerCount) {
      for (let o of Object.values(tree)) {
        if (!selected.includes(o.value)) {
          o.isDisabled = true;
        }
      }
    }
  }

  _checkNonSelectableOptions(tree) {
    const question = this.props.question;

    for (let o of Object.values(tree)) {
      if (
        JsonLdUtils.hasValue(
          question,
          Constants.HAS_NON_SELECTABLE_VALUE,
          o.value
        )
      ) {
        o.isDisabled = true;
      }
    }
  }

  _checkDisjointOptions(tree, selected) {
    for (let o of Object.values(tree)) {
      o.isDisabled = false;
    }

    if (selected === undefined) {
      selected = this.state.selected;
    }

    if (selected) {
      for (let selectedOption of selected) {
        for (let d of selectedOption.disjoint) {
          if (tree[d]) {
            tree[d].isDisabled = true;
          }
        }
      }

      this._checkMaxNumberOfAnswers(tree, selected);
    }

    this._checkNonSelectableOptions(tree);
    if (this.state.tree !== tree) {
      this.setState({
        optionsList: Object.values(tree),
      });
    }

    return tree;
  }

  _isTotalDisjoint(tree) {
    const options = Object.values(tree);

    for (let option of options) {
      if (options.length - 1 !== option.disjoint.length) {
        return false;
      }
    }

    return true;
  }

  _isRegenerationNeeded(previousQuestion) {
    if (!Object.values(this.state.tree).length) {
      return true;
    }
    const question = this.props.question;
    return !Utils.hasArraySameValues(
      previousQuestion[SConstants.HAS_OPTION],
      question[SConstants.HAS_OPTION]
    );
  }

  _generateOptions() {
    const question = this.props.question;
    const possibleValues = question[SConstants.HAS_OPTION];
    if (!possibleValues || !possibleValues.length) {
      return [];
    }

    const options = {};
    const relations = [];

    for (let pValue of possibleValues) {
      let label = JsonLdUtils.getLocalized(
        pValue[SConstants.RDFS_LABEL],
        this.context.options.intl
      );

      options[pValue["@id"]] = {
        value: pValue["@id"],
        label: label,
        children: [],
        disjoint: [],
      };

      if (pValue[Constants.DISJOINT_WITH]) {
        let disjoints = pValue[Constants.DISJOINT_WITH];

        if (disjoints.length === undefined) {
          // only single disjoint without array
          disjoints = [disjoints];
        }

        for (let disjoint of disjoints) {
          relations.push({
            type: "disjoint",
            a: disjoint["@id"],
            b: pValue["@id"],
          });
        }
      }

      for (let parent of Utils.asArray(pValue[Constants.BROADER])) {
        relations.push({
          type: "parent-child",
          parent: parent["@id"],
          child: pValue["@id"],
        });
      }
    }

    const pushDisjoint = (a, b) => {
      if (!options[a].disjoint.includes(b)) {
        options[a].disjoint.push(b);
      }
    };

    for (let relation of relations) {
      if (relation.type === "parent-child") {
        options[relation.parent]?.children.push(relation.child);
      }

      if (relation.type === "disjoint") {
        if (options[relation.a] && options[relation.b]) {
          pushDisjoint(relation.a, relation.b);
          pushDisjoint(relation.b, relation.a);
        }
      }
    }

    const answers = this._loadAnswers(options);

    let totalDisjoint = this._isTotalDisjoint(options);

    if (this._getMaxNumberOfAnswers() <= 1) {
      // single answer allowed
      totalDisjoint = true;
    }

    if (!totalDisjoint) {
      this._checkDisjointOptions(options, answers);
    }

    this._checkNonSelectableOptions(options);

    this.setState({
      tree: options,
      optionsList: Object.values(options),
      singleSelect: totalDisjoint,
      selected: answers,
    });
  }

  _renderSelect() {
    if (!this.state.optionsList.length) {
      return null;
    }

    let selectedValue = this.state.selected;
    if (this.state.singleSelect) {
      selectedValue = selectedValue?.[0];
    }

    return (
      <div onClick={(e) => e.stopPropagation()}>
        <IntelligentTreeSelect
          value={selectedValue}
          className="react-select-container"
          classNamePrefix="react-select"
          valueKey="value"
          labelKey="label"
          childrenKey="children"
          options={this.state.optionsList}
          expanded={true}
          closeMenuOnSelect={this.state.singleSelect}
          onChange={this._handleChange}
          multi={!this.state.singleSelect}
          showSettings={false}
          renderAsTree={true}
          optionLeftOffset={5}
        />
      </div>
    );
  }

  _renderLabel() {
    const label = JsonLdUtils.getLocalized(
      this.props.question[SConstants.RDFS_LABEL],
      this.context.options.intl
    );
    return <Form.Label>{label}</Form.Label>;
  }

  componentDidMount() {
    this._generateOptions();
  }

  componentDidUpdate(prevProps) {
    if (this._isRegenerationNeeded(prevProps.question)) {
      console.debug("regeneration needed");
      this._generateOptions();
    }
  }

  render() {
    const question = this.props.question;
    const options = this.context.options;
    const onCommentChange = this.props.onCommentChange;
    const showIcon = this.props.showIcon;

    if (this.props.isInSectionHeader) {
      return (
        <div className="type-answer-group">
          {this._renderLabel()}
          {QuestionStatic.renderIcons(
            question,
            options,
            onCommentChange,
            showIcon
          )}
          {this._renderSelect()}
        </div>
      );
    }

    return (
      <FormGroup>
        {this._renderLabel()}
        {QuestionStatic.renderIcons(
          question,
          options,
          onCommentChange,
          showIcon
        )}
        {this._renderSelect()}
      </FormGroup>
    );
  }
}

TypeQuestionAnswer.contextType = ConfigurationContext;

TypeQuestionAnswer.propTypes = {
  index: PropTypes.number.isRequired,
  answer: PropTypes.object.isRequired,
  question: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onCommentChange: PropTypes.func.isRequired,
  showIcon: PropTypes.bool.isRequired,
  onSubChange: PropTypes.func.isRequired,
  isInSectionHeader: PropTypes.bool,
};
