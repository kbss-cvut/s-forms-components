import React from 'react';
import ReactDOM from 'react-dom';
import SForms, {Constants, IntlContextProvider} from 's-forms';
import SmartComponents from "../src/SmartComponents";

import 's-forms/css/s-forms.min.css';
import '../src/styles/components.css';
import 'react-datepicker/dist/react-datepicker.css';
import "intelligent-tree-select/lib/styles.css"
import * as exampleForm from './example_form.json';
import * as exampleFormTC from './example_turisticky_cil.json';

const componentMapping = SmartComponents.getComponentMapping();

const modalProps = {
  onHide: () => {
  },
  show: true,
  title: 'Title'
};

const options = {
  i18n: {
    'wizard.next': 'Next',
    'wizard.previous': 'Previous',
    'section.expand': 'Expand',
    'section.collapse': 'Collapse'
  },
  intl: {
    locale: 'cs'
  },
  modalView: false,
  modalProps,
  horizontalWizardNav: false,
  wizardStepButtons: true,
  enableForwardSkip: true,
  startingStep: 1,
  users: [
    {id: "http://fel.cvut.cz/people/max-chopart", label: "Max Chopart"},
    {id: "http://fel.cvut.cz/people/miroslav-blasko", label: "Miroslav Blasko"}],
  currentUser: "http://fel.cvut.cz/people/max-chopart",
  icons: [
    {id: Constants.ICONS.QUESTION_HELP, behavior:  Constants.ICON_BEHAVIOR.ENABLE},
    {id: Constants.ICONS.QUESTION_COMMENTS, behavior: Constants.ICON_BEHAVIOR.ON_HOVER},
    {id: Constants.ICONS.QUESTION_LINK, behavior:  Constants.ICON_BEHAVIOR.ON_HOVER},
  ]
};

class ExampleApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFormValid: false,
      selectedForm: exampleForm
    };
    this.refForm = React.createRef();
  }

  fetchTypeAheadValues = (query) => {
    const possibleValues = require('./possibleValues.json');
    return new Promise((resolve) => setTimeout(() => resolve(possibleValues), 1500));
  };

  render() {
    return (
      <div className="p-4">
        <IntlContextProvider locale={options.intl.locale}>
          <SForms
            ref={this.refForm}
            form={this.state.selectedForm}
            options={options}
            fetchTypeAheadValues={this.fetchTypeAheadValues}
            isFormValid={(isFormValid) => this.setState({isFormValid})}
            componentMapRules={componentMapping}
          />
        </IntlContextProvider>
        <div>
          Second form demonstrates show advanced switch and sections with answer.
          Use the switch form button bellow to switch between individual forms.
        </div>
        <button
          disabled={!this.state.isFormValid}
          style={{width: '100px', margin: '8px 16px', position: 'relative', left: '50%'}}
          onClick={() => {
            this.setState((prevState) => (
              {selectedForm: prevState.selectedForm === exampleFormTC ? exampleForm : exampleFormTC}
            ));
          }}
        >
          Switch form
        </button>
      </div>

    );
  }
}

ReactDOM.render(<ExampleApp/>, document.getElementById('container'));
