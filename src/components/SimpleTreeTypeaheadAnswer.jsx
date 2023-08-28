import React from "react";
import { Form, FormGroup } from "react-bootstrap";
import JsonLdUtils from "jsonld-utils";
import {
  QuestionStatic,
  Constants as SConstants,
  ConfigurationContext,
  FormUtils,
} from "@kbss-cvut/s-forms";
import Constants from "../Constants";
import { IntelligentTreeSelect } from "intelligent-tree-select";
import Utils from "../Utils";
import PropTypes from "prop-types";

export default class SimpleTreeTypeaheadAnswer extends React.Component {
  // Maybe add that the options are structured as tree - for example Constants.TREE_SELECT
  static mappingRule = (q) => FormUtils.isTypeahead(q);

  constructor(props) {
    super(props);

    this.state = {
      tree: {},
      optionsList: [],
      selected: {},
    };
  }

  _handleChange = (value) => {
    const change = { ...this.props.answer };

    if (!value) {
      this.setState({
        selected: {},
      });
      change[SConstants.HAS_DATA_VALUE] = {
        "@value": null,
      };
      this.props.onChange(this.props.index, change);
      return;
    }

    change[SConstants.HAS_DATA_VALUE] = {
      "@value": value["value"],
    };

    this.setState({
      selected: value,
    });

    this.props.onChange(this.props.index, change);
  };

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
      for (let parent of Utils.asArray(pValue[Constants.BROADER])) {
        relations.push({
          type: "parent-child",
          parent: parent["@id"],
          child: pValue["@id"],
        });
      }
    }

    for (let relation of relations) {
      if (relation.type === "parent-child") {
        options[relation.parent]?.children.push(relation.child);
      }
    }

    this._checkNonSelectableOptions(options);

    this.setState({
      tree: options,
      optionsList: Object.values(options),
    });
  }

  _renderSelect() {
    if (!this.state.optionsList.length) {
      return null;
    }

    return (
      <IntelligentTreeSelect
        value={this.state.selected}
        className="react-select-simple-container"
        classNamePrefix="react-select-simple"
        valueKey="value"
        labelKey="label"
        childrenKey="children"
        options={this.state.optionsList}
        expanded={true}
        closeMenuOnSelect={true}
        onChange={this._handleChange}
        multi={false}
        showSettings={false}
        renderAsTree={true}
        optionLeftOffset={5}
      />
    );
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

    const label = JsonLdUtils.getLocalized(
      this.props.question[SConstants.RDFS_LABEL],
      this.context.options.intl
    );

    return (
      <FormGroup>
        <Form.Label>
          <div className="question-header">
            {label}
            {QuestionStatic.renderIcons(
              question,
              options,
              onCommentChange,
              showIcon
            )}
          </div>
        </Form.Label>
        {this._renderSelect()}
      </FormGroup>
    );
  }
}

SimpleTreeTypeaheadAnswer.contextType = ConfigurationContext;

SimpleTreeTypeaheadAnswer.propTypes = {
  index: PropTypes.number.isRequired,
  answer: PropTypes.object.isRequired,
  question: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onCommentChange: PropTypes.func.isRequired,
  showIcon: PropTypes.bool.isRequired,
  onSubChange: PropTypes.func.isRequired,
};
