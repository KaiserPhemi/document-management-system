import React, { Component } from 'react';
import { connect } from 'react-redux';
import toastr from 'toastr';
import { bindActionCreators } from 'redux';
import validateInput from '../../utilities/CheckDocument';
import DocumentForm from './DocumentForm';
import * as documentActions from '../../actions/DocumentAction';
/**
 * Root component defined as class
 */
class ManageDocumentPage extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      document: {},
      errors: {},
      saving: false,
    };

    this.updateDocumentState = this.updateDocumentState.bind(this);
    this.saveDocument = this.saveDocument.bind(this);
    this.redirect = this.redirect.bind(this);
  }
  /**
   * Called during updating phase
   * @param {Object} nextProps
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.document.id !== nextProps.document.id) {
      this.setState({ document: Object.assign({}, nextProps.document) });
    }
  }
  /**
   * Update
   * @param {Object} event
   */
  updateDocumentState(event) {
    const field = event.target.name;
    const document = this.state.document;
    if (event.target.id === 'content') {
      document.content = event.target.getContent();
    }
    document[field] = event.target.value;
    return this.setState({ document });
  }
  /**
   * Called if document is saved successfully
   */
  saveSuccess() { this.redirect(); }
  /**
   * Called when saving document fails
   * @param {Object} error
   */
  saveFailure(error) {
    toastr.error(error);
    this.setState({ saving: false });
  }
  /**
   * Checks if document metadata exist
   */
  isValid() {
    const data = {
      title: this.state.document.title,
      content: this.state.document.content,
      access: this.state.document.access
    };
    const { errors, isValid } = validateInput(data);
    if (!isValid) {
      this.setState({ errors });
    }
    return isValid;
  }
  /**
   * Handles saving of document
   * @param {Object} event
   */
  saveDocument(event) {
    event.preventDefault();
    if (this.isValid()) {
      this.setState({ saving: true, errors: {} });
      if (this.state.document.id) {
        this.props.actions.updateDocument(this.state.document)
            .then(this.saveSuccess.bind(this), this.saveFailure.bind(this));
      } else {
        this.props.actions.saveDocument(this.state.document)
          .then(this.saveSuccess.bind(this), this.saveFailure.bind(this));
      }
    }
  }
  /**
   * Handles redirection
   */
  redirect() {
    this.setState({ saving: false });
    toastr.success('Document saved');
    this.context.router.push('/');
  }
  /**
   * Renders to the DOM
   */
  render() {
    return (
      <div className="container">
        <DocumentForm
          onChange={this.updateDocumentState}
          onSave={this.saveDocument}
          document={this.state.document}
          errors={this.state.errors}
          saving={this.state.saving}
        />
      </div>
    );
  }
}

ManageDocumentPage.propTypes = {
  document: React.PropTypes.object,
  actions: React.PropTypes.object.isRequired,
};

ManageDocumentPage.contextTypes = {
  router: React.PropTypes.object,
};

const getDocumentById = (documents, id) => {
    const document = documents.filter(item => item.id === id);
    if (document) {
      return document[0];
    }
    return null;
  },
  mapStateToProps = (state, ownProps) => {
    const documentId = ownProps.params.id;
    let document;
    if (documentId && state.documents.length > 0) {
      document = getDocumentById(state.documents, parseInt(documentId, 10));
    }
    return {
      document,
    };
  },

  mapDispatchToProps = (dispatch) => {
    return {
      actions: bindActionCreators(documentActions, dispatch),
    };
  };

export default connect(mapStateToProps, mapDispatchToProps)(ManageDocumentPage);
