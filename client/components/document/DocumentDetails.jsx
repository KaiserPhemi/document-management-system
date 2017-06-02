/* eslint "react/no-danger": 0 */
import React from 'react';
import { Link } from 'react-router';

const DocumentDetails = (
  { document, deleteDocument, currentUser }
  ) => {
  return (
    <div className="col s12">
      <div className="card">
        <div className="card-content white-text">
          <span className="card-title">{document.title}</span>
          <p dangerouslySetInnerHTML={{ __html: document.content }} className="document-content" />
          <br />
          <p>Access Type: &nbsp;
            <span>{(document.access).toUpperCase()}</span></p><br />
          <div>
              Published Date :
            <p>{(document.createdAt) ?
              document.createdAt.split('T')[0] : ''}</p>
            <p id="owner">Author:
              {document.User.firstName} {document.User.lastName}</p>
          </div>
        </div>
        <div className="card-action">
          <Link to="/">back</Link>
          {currentUser.userId === document.ownerId &&
            <div className="right">
              <Link to={`/documents/${document.id}`}>Edit</Link>
              <Link to="/" onClick={() => deleteDocument(document.id)}> Delete </Link>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

DocumentDetails.propTypes = {
  document: React.PropTypes.object.isRequired,
  deleteDocument: React.PropTypes.func.isRequired,
  currentUser: React.PropTypes.object.isRequired,
};
export default DocumentDetails;
