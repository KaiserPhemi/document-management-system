import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import toastr from 'toastr';
import { Pagination } from 'react-materialize';
import DocumentsList from './DocumentsList';
import * as DocumentAction from '../../actions/DocumentAction';
import * as SearchAction from '../../actions/Search';
import Search from '../shared/SearchBox';
import SelectInput from '../shared/SelectInput';
import access from '../../data/options';
/**
 * Defined as class component.
 */
class DocumentsPage extends Component {
  /**
   * Component properties
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.state = {
      renderedDocuments: props.documents,
      filtered: false,
      access: 'public',
      isSearching: false
    };
    this.onChange = this.onChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.removeDocument = this.removeDocument.bind(this);
    this.displayDocuments = this.displayDocuments.bind(this);
    this.filterDocument = this.filterDocument.bind(this);
    this.deleteUserDoc = this.deleteUserDoc.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
  }
  /**
   * Called when access type is changed
   */
  onChange(event) {
    event.preventDefault();
  }
  /**
   * Checks for rendered document
   */
  componentWillMount() {
    this.props.actions.fetchDocuments();
    this.setState({ renderedDocuments: this.props.documents });
  }
  /**
   * Called after render method
   */
  componentDidMount() {
    $('select').material_select();
    $('#section').on('change', this.filterDocument);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      renderedDocuments: nextProps.documents
    });
    $('select').material_select();
    $('#section').on('change', this.filterDocument);
  }
  /**
   * Handles document deletion and notification
   * @param {Number} id Specific document Id
   */
  removeDocument(id) {
    this.props.deleteDocument(id)
      .then(() => toastr.success('Document deleted successfully!'));
  }
  /**
   * Handles search feature
   * @param  {Object} event Events from user input
   */
  handleSearch(event) {
    event.preventDefault();
    const query = event.target.value;
    this.setState({
      query,
    });
    this.props.actions.searchDocuments(query);
    const documentSearchResult = this.props.search;
    if (query.trim().length > 0) {
      this.setState({
        isSearching: true,
        renderedDocuments: documentSearchResult
      });
    }
  }
  /**
   * Displays list of document
   * @param  {Number} pageNumber
   */
  displayDocuments(pageNumber) {
    const offset = (pageNumber - 1)
      * this.props.metadata.pageSize;
    this.props.actions.fetchDocuments(offset);
  }
  clearSearch() {
    this.setState({
      isSearching: false,
      access: 'public',
      renderedDocuments: this.props.documents
    }, () => {
      this.props.actions.fetchDocuments();
    });
  }
  /**
   * Returns list of documents with public access
   */
  filterDocument(event) {
    this.setState({ access: event.target.value });
  }
  /**
   * [deleteUserDoc description]
   * @param  {Number} docId Document Id
   * @return {Object}
   */
  deleteUserDoc(docId) {
    this.props.actions.deleteDocument(docId);
  }
  /**
   * Renders to the DOM
   * @return {Object}
   */
  render() {
    const {
      totalCount,
      pageSize,
      currentPage,
      pageCount } = this.props.metadata;
    let allDocuments;
    if (!this.state.isSearching) {
      allDocuments =
      this.state.renderedDocuments
      .filter(document => document.access === this.state.access);
    } else {
      allDocuments = this.state.renderedDocuments;
    }
    return (
      <div className="container">
        <h4 className="center">Available Documents</h4>
        <div className="row">
          <div className="col s7 push-s4">
            <Search id="search" onChange={this.handleSearch} />
          </div>
          <div className="col s5 pull-s7" id="createdocument">
            <Link
            id="create-doc"
            className="btn blue darken-4"
            to="document">
              Add Document
            </Link>
          </div>
        </div>
        <div className="row">
            {!this.state.isSearching ?
              <div className="col s4">
              <SelectInput
              id="section"
              name="section"
              options={access}
              onChange={this.onChange}
              label="Filter Documents by Access"
              /></div> :
              <nav className="blue darken-4">
              <div className="nav-wrapper">
              <ul>
              <li />
              <li>Showing result for "{this.state.query}"</li>
              <li><a onClick={this.clearSearch}>
              <i className="material-icons">clear</i>
              </a></li>
              </ul>
              </div>
              </nav>
          }
        </div>
        <DocumentsList
          documents={allDocuments}
          filtered={this.state.filtered}
          notFiltered={allDocuments}
          deleteDocument={this.deleteUserDoc}
          currentUser={this.props.auth.user}
        />
        <Pagination
          items={pageCount}
          activePage={currentPage}
          maxButtons={Math.ceil(totalCount / pageSize)}
          onSelect={this.displayDocuments}
        />
      </div>
    );
  }
}

DocumentsPage.propTypes = {
  search: React.PropTypes.array,
  fetchDocuments: React.PropTypes.func,
  deleteDocument: React.PropTypes.func,
  searchDocuments: React.PropTypes.func,
  auth: React.PropTypes.object,
  documents: React.PropTypes.array,
  metadata: React.PropTypes.object
};
/**
 * Maps state to properties
 * @param  {Object} state
 * @return {object}
 */
const mapStateToProps = (state) => {
  let documents = [];
  console.log(state.documents);
  documents = state.documents;
  return {
    documents,
    search: state.search,
    auth: state.auth,
    metadata: state.paginate
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(
    Object.assign(DocumentAction, SearchAction), dispatch),
  };
  };

export default connect(mapStateToProps, mapDispatchToProps)(DocumentsPage);
