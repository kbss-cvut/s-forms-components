# SForms Components
[![Netlify Status](https://api.netlify.com/api/v1/badges/5b9b7cb6-08ed-44ea-a8d5-6f5105eec634/deploy-status)](https://app.netlify.com/sites/s-forms-components-kbss/deploys)


This library is an extension of [SForms](https://github.com/kbss-cvut/s-forms) - a semantic form generator and processor for ontology-based smart forms.
SForms components are displayed based on structure of provided semantic form data and extend basic functionality of SForms.

## Live Demo

Checkout [live demo using storybook](https://s-forms-components-kbss.netlify.app).


## Development

Packiging SForms Components library for usage in other projects is done by `npm run build:lib`.

### Debugging a form & components with StorybookJS

Storybook is an open source tool for building UI components and pages in isolation. Rendering of a form or a specific component can be tested through a story provided in `./src/stories/`. The application can be started by executing npm script through `npm run dev` and then accessing `loaclhost:6006` from a browser. It renders the forms provided by the file `./src/stories/assets/`.

### NPM release worklow

NPM packages are created automatically for each commit to this repository, see [npm release workflow guide in SForms project](https://github.com/kbss-cvut/s-forms/blob/master/docs/npm-release-workflow.md).
