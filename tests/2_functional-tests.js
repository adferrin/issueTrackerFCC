const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

// Create an issue with every field: POST request to /api/issues/{project}
// Create an issue with only required fields: POST request to /api/issues/{project}
// Create an issue with missing required fields: POST request to /api/issues/{project}
// View issues on a project: GET request to /api/issues/{project}
// View issues on a project with one filter: GET request to /api/issues/{project}
// View issues on a project with multiple filters: GET request to /api/issues/{project}
// Update one field on an issue: PUT request to /api/issues/{project}
// Update multiple fields on an issue: PUT request to /api/issues/{project}
// Update an issue with missing _id: PUT request to /api/issues/{project}
// Update an issue with no fields to update: PUT request to /api/issues/{project}
// Update an issue with an invalid _id: PUT request to /api/issues/{project}
// Delete an issue: DELETE request to /api/issues/{project}
// Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
// Delete an issue with missing _id: DELETE request to /api/issues/{project}
let deleteId;
suite("Functional Tests", function() {
  suite("Routing Tests", function() {
      suite("3 Post request Tests", function() {
          test("Create an issue witth every field: POST request to /api/issues/{project}", function(done) {
              chai
                .request(server)
                .post("/api/issues/projects")
                .set("content-type", "application/json")
                .send({
                    issue_title: "Issue",
                    issue_text: "Functional Test",
                    created_by: "FCC",
                    assigned_to: "Dom",
                    status_text: "Not Done",
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    deleteId = res.body._id;
                    assert.equal(res.body.issue_title, "Issue");
                    assert.equal(res.body.assigned_to, "Dom");
                    assert.equal(res.body.created_by, "FCC");
                    assert.equal(res.body.status_text, "Not Done");
                    assert.equal(res.body.issue_text, "Functional Test");
                    done();
              });
          });
          test("Create an issue with only required fields: POST request to /api/issues/{project}", function (done) {
              chai
                .request(server)
                .post("/api/issues/projects")
                .set("content-type", "application/json")
                .send({
                    issue_title: "Issue",
                    issue_text: "Functional Test",
                    created_by: "FCC",
                    assigned_to: "",
                    status_text: "",
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.issue_title, "Issue");
                    assert.equal(res.body.assigned_to, "");
                    assert.equal(res.body.created_by, "FCC");
                    assert.equal(res.body.status_text, "");
                    assert.equal(res.body.issue_text, "Functional Test");
                    done();
                });    
          });
        test("Create an issue with missing required fields: POST request to /api/issues/{project}", function (done) {
            chai
            .request(server)
                .post("/api/issues/projects")
                .set("content-type", "application/json")
                .send({
                    issue_title: "",
                    issue_text: "",
                    created_by: "FCC",
                    assigned_to: "",
                    status_text: "",
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, "required field(s) missing");
                    done();
                });
            });
        });

        // Get request tests //

        suite("3 Get request Tests", function () {
            test("View issies on a project: GET request to /api/issues/{project}", function (done) {
                chai
                .request(server)
                .get("/api/issues/test-data-abc123")
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.length, 4);
                    done();
                });
            });
            test("View issues on a project with one filter: GET request to /api/issues/{project}", function (done) {
                chai
                    .request(server)
                    .get("/api/issues/test-data-abc123")
                    .query({
                        _id: "fill me in",
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.deepEqual(res.body[0], {
                            _id: "fill me in",
                            issue_title: "Hey",
                            issue_text: "some text",
                            created_on: "copy over",
                            updated_on: "copy over",
                            created_by: "Austin",
                            assigned_to: "",
                            opend: true,
                            status_text: "",
                        });
                        done();
                    });
                });
            test("View issues on a project with multiple filters: GET request to /api/issues/{project}", function (done) {
                chai
                    .request(server)
                    .get("/api/issues/test-data-abc123")
                    .query({
                        issue_title: "hey",
                        issue_title: "testing"
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.deepEqual(res.body[0], {
                            _id: "fill me in",
                            issue_title: "Hey",
                            issue_text: "some text",
                            created_on: "copy over",
                            updated_on: "copy over",
                            created_by: "Austin",
                            assigned_to: "",
                            opend: true,
                            status_text: "",
                        });
                        done();
                    });
                });
            });
        ///// PUT request test /////

        suite("5 PUT request tests", function () {
            test("Update one field on an issue: PUT request to /api/issues/test-data-put", function (done) {
                chai
                    .request(server)
                    .put("/api/issues/test-data-put")
                    .send({
                        _id: "fill me in",
                        issue_title: "fill me in",
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.result, "successfully updated");
                        assert.equal(res.body._id, "match to above issue");
                        done();
                    });
            });
            test("Update multiple fields on an issue: PUT request to /api/issues/{project}", function (done) {
                chai
                    .request(server)
                    .put("/api/issues/test-data-put")
                    .send({
                        _id: "fill me in",
                        issue_title: "fill me in",
                        issue_text: "fill me in"
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.result, "successfully updated");
                        assert.equal(res.body._id, "match to above issue");
                        done();
                    });
            });
            test("Update an issue with missing _id: PUT request to /api/issues/{project}", function (done) {
                chai
                    .request(server)
                    .put("/api/issues/test-data-put")
                    .send({
                        issue_title: "update",
                        issue_text: "update",
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.error, "missing _id");
                        done();
                    });
            });
            test("Update an issue with no fields to update: PUT request to /api/issues/{project}", function (done) {
                chai
                    .request(server)
                    .put("/api/issues/test-data-put")
                    .send({
                        _id: "fill me in",
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.error, "no update field(s) sent");
                        done();
                    });
            });
            test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", function (done) {
                chai
                    .request(server)
                    .put("/api/issues/test-data-put")
                    .send({
                        _id: "fill me in",  
                        issue_title: "update",
                        issue_text: "update",
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.error, "could not update");
                        done();
                    });
            });
        });
        ////// Delete request test//////
        
        suite("3 DELETE request Tests", function () {
            test("Delete an issue: DELETE request to /api/issues/{projects}", function (done) {
                chai
                .request(server)
                .delete("/api/issues/projects")
                .send({
                    _id: deleteId,
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, "successfully deleted");
                    done();
                });
            });
            test("Delete an issues with an invalid _id: DELETE request to /api/issues/{project}", function (done) {
                chai
                    .request(server)
                    .delete("/api/issues/projects")
                    .send({
                        _id: "fill me in",
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.error, "could not delete");
                        done();
                    });
            });
            test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", function (done) {
                chai
                    .request(server)
                    .delete("/api/issues/projects")
                    .send({})
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(rees.body.error, "missing _id");
                        done();
                    });
            });
        });
  });
});
