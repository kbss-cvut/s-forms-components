import React from 'react';
import {
  WizardStep,
  Question,
  Constants as SConstants,
  FormUtils,
  FormQuestionsContext,
  QuestionStatic
} from '@kbss-cvut/s-forms';
import {Card} from 'react-bootstrap';
import JsonLdUtils from 'jsonld-utils';
import ShowAdvancedSwitch from "./ShowAdvancedSwitch";
import Constants from "../Constants";
import SectionIdentifier from "./SectionIdentifier";


export default class WizardStepComponent extends WizardStep {

  static mappingRule = q => FormUtils.isWizardStep(q);

  constructor(props) {
    super(props);
    this.state = {
      showIcon: false
    }

    this.card = React.createRef();
    this.cardHeader = React.createRef();

    this.state = {
      headerFloating: false,
      headerWidth: 0,
      headerHeight: 0
    }
  }

  componentDidMount() {
    if (this._isSticky()) {
      window.addEventListener('scroll', this._handleScroll);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this._handleScroll);
  }

  _isSticky() {
    const question = this.props.question;
    return JsonLdUtils.hasValue(
      question,
      SConstants.LAYOUT_CLASS,
      Constants.LAYOUT_STICKY
    );
  }

  _handleScroll = () => {
    /**
     * @type {HTMLDivElement}
     */
    const card = this.card.current;
    /**
     * @type {HTMLHeadingElement}
     */
    const header = this.cardHeader.current;
    if (!card || !header) {
      return;
    }

    const box = card.getBoundingClientRect();

    if (box.top <= 0) {

      if (!this.state.headerFloating) {

        const headerBox = header.getBoundingClientRect();

        this.setState({
          headerFloating: true,
          headerWidth: headerBox.width,
          headerHeight: headerBox.height
        })
      }

    } else {

      if (this.state.headerFloating) {
        this.setState({
          headerFloating: false,
          headerWidth: 0,
          headerHeight: 0
        })
      }

    }
  }


  _renderIdentifierText() {
    return (
      <SectionIdentifier question={this.props.question} prefix="(" suffix=")" />
    );
  }

  _renderShowAdvanced() {
    const question = this.props.question;

    if (!ShowAdvancedSwitch.mappingRule(question)) {
      return null;
    }

    return (
      <ShowAdvancedSwitch
        question={this.props.question}
        onChange={this.onChange}
        index={this.props.index}
      />
    );
  }

  render() {
    return (
      <React.Fragment>
        <Question
          question={this.props.question}
          onChange={this.onChange}
          collapsible={FormUtils.isAnswerable(this.props.question)}
        >
          {this._renderIdentifierText()}
          {this._renderShowAdvanced()}
        </Question>
        {this.props.options.wizardStepButtons &&
          this._renderWizardStepButtons()}
      </React.Fragment>
    );
  }
}

WizardStepComponent.contextType = FormQuestionsContext;
