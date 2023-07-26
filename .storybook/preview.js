import "../src/styles/components.css";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/@kbss-cvut/s-forms/dist/s-forms.css";
import "intelligent-tree-select/lib/styles.css";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

const preview = {
  decorators: [(Story, context) => <Story />],
};
export default preview;
