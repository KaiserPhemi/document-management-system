/**
 * Dependencies declared
 */
import db from '../models';
import Helper from '../helpers/Helper';
/**
 * Document Controller
 */
const DocumentController = {
  /**
   * Create a new document
   * Route: POST /documents/
   * @param {Object} request Request object
   * @param {Object} response Response object
   */
  createDocument(request, response) {
    const { title, content, access } = request.body,
      ownerId = request.tokenDecode.userId,
      ownerRoleId = request.tokenDecode.roleId;
    if (!title) {
      response.status(400)
      .send({
        message: 'Please type in a title for the document'
      });
    }
    if (!content) {
      response.status(400)
      .send({
        message: 'Please type in content for the document'
      });
    }
    request.body.access = request.body.access || 'public';
    db.Document
      .create({ title, content, access, ownerId, ownerRoleId })
        .then((createdDoc) => {
          createdDoc = Helper.getDocument(createdDoc);
          response.status(201)
            .send({
              message: 'Your document was created succesfully.',
              createdDoc
            });
        })
        .catch(() => {
          response.status(400)
            .send({
              message: 'An error has occured. Document not created.'
            });
        });
  },
  /**
   * Get a document by Id
   * Route: GET /documents/:id
   * @param {Object} request Request object
   * @param {Object} response Response object
   */
  getDocument(request, response) {
    db.Document.findById(request.params.id)
      .then((searchedDoc) => {
        if (!searchedDoc) {
          return response.status(404)
            .send({
              message: 'Document not found'
            });
        }
        if (searchedDoc.access === 'public' ||
          searchedDoc.ownerId === request.decoded.userId) {
          return response.status(200)
            .send({
              message: 'Document retrieved succesfully.',
              searchedDoc,
            });
        }
        response.status(400)
          .send({
            message: 'Document is private'
          });
      })
      .catch(() => {
        response.status(500)
          .send({
            message: 'Invalid query details.'
          });
      });
  },
  /**
   * Gets instances of all document
   * Route: GET /documents/?limit=10&offset=1
   * @param {Object} request Request object
   * @param {Object} response Response object
   */
  getAllDocuments(request, response) {
    const dbQuery = {
      where: {
        $or: [
          { access: 'public' },
          { ownerId: request.tokenDecode.userId }
        ]
      },
      include: [{ model: db.User,
        attributes: ['id', 'username', 'firstName', 'lastName'] }],
      limit: request.query.limit,
      offset: request.query.offset || 0,
      order: [['createdAt', 'DESC']]
    };
    db.Document
      .findAndCountAll(dbQuery)
      .then((documents) => {
        const constraint = {
          count: documents.count,
          limit: dbQuery.limit,
          offset: dbQuery.offset
        };
        delete documents.count;
        const paging = Helper.paging(constraint);
        response.status(200)
          .send({
            message: 'You have successfully retrieved all documents.',
            documents,
            paging
          });
      })
      .catch(() => {
        response.status(401)
          .send({
            message: 'Unauthorized access'
          });
      });
  },
  /**
   * Updates a document/document attributes by Id
   * Route: PUT /documents/:id
   * @param {Object} request Request object
   * @param {Object} response Response object
   */
  updateDocument(request, response) {
    db.Document.findById(request.params.id)
      .then((requiredDocument) => {
        if (!requiredDocument) {
          return response.status(404)
            .send({
              message: 'Document not found'
            });
        }
        requiredDocument.update(request.body)
          .then((updatedDocument) => {
            db.Document.findById(updatedDocument.id)
              .then((docData) => {
                response.status(200)
                  .send({
                    message: 'This document has been updated successfully.',
                    docData
                  });
              })
              .catch(() => {
                response.status(404)
                  .send({
                    message: 'Document not found'
                  });
              });
          });
      })
      .catch(() => {
        response.status(500)
          .send({
            message: 'Invalid parameters. Document not retrieved'
          });
      });
  },
  /**
   * Delete document by Id
   * Route: DELETE /documents/:id
   * @param {Object} request Request object
   * @param {Object} response Response object
   */
  deleteDocument(request, response) {
    db.Document.findById(request.params.id)
      .then((document) => {
        if (!document) {
          return response.status(404)
            .send({
              message: 'Document not found'
            });
        }
        if (document.ownerId === request.tokenDecode.userId ||
          request.tokenDecode.roleId === 1) {
          document.destroy()
            .then(() => {
              response.status(200)
                .send({
                  message: 'Document deleted succesfully',
                });
            });
        } else {
          return response.status(403)
            .send({
              message: 'Document does not belong to you. You cannot delete it.'
            });
        }
      })
      .catch(() => {
        response.status(500)
          .send({
            message: 'Document not found'
          });
      });
  },
  /**
   * Search for documents by title
   * Route: GET: /search/documents?q={title}
   * @param {Object} request Request object
   * @param {Object} response Response object
   * @returns {void} no returns
   */
  searchDocument(request, response) {
    const queryString = request.query.q;
    const query = {
      where: {
        $and: [{ $or: [
          { access: 'public' },
          { ownerId: request.tokenDecode.userId },
        ],
        }],
      },
      include: [{ model: db.User }],
      limit: request.query.limit || 10,
      offset: request.query.offset || 0,
      order: [['createdAt', 'DESC']]
    };

    if (queryString) {
      query.where.$and.push({ $or: [
        { title: { $iLike: `%${queryString}%` } },
      ] });
    }
    db.Document.findAndCountAll(query)
      .then((allDocs) => {
        const results = allDocs.rows.map(doc => Helper.getDocument(doc));
        const constraint = {
          count: allDocs.count,
          limit: query.limit,
          offset: query.offset
        };
        delete allDocs.count;
        const paging = Helper.paging(constraint);
        response.status(200)
          .send({
            paging,
            rows: results
          });
        response.status(200)
          .send(results);
      });
  }
};

export default DocumentController;
