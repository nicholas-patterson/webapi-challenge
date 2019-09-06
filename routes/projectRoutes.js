const express = require("express");
const db = require("../data/helpers/projectModel");
const router = express.Router();

// Get Method To All Projects
router.get("/", (req, res) => {
  db.get()
    .then(resources => {
      res.status(200).json(resources);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "Server could not retrieve list of projects" });
    });
});

// Get Method To Single Project

router.get("/:id", validateProjectId, (req, res) => {
  const id = req.params.id;
  db.get(id).then(resource => {
    res.status(200).json(resource);
  });
});

// Get all actions for specific project ID

router.get("/:id/specificactions", validateProjectId, (req, res) => {
  const id = req.params.id;
  db.getProjectActions(id).then(resources => {
    console.log(resources);
    res.status(200).json(resources);
  });
});

// Post method for project

router.post("/", (req, res) => {
  const project = req.body;
  db.insert(project)
    .then(resource => {
      res.status(201).json(resource);
    })
    .catch(err => {
      res.status(500).json({ error: "Server could not post project" });
    });
});

// Update method for project

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const updatedInfo = req.body;

  if (!req.body.name || !req.body.description) {
    res
      .status(404)
      .json({ error: "Project is missing required fields...can not update" });
  } else {
    db.update(id, updatedInfo).then(resource => {
      if (!resource) {
        res
          .status(400)
          .json({ error: "Could not update project with that given ID" });
      } else {
        res.status(200).json(resource);
      }
    });
  }
});

// Remove Method for project

router.delete("/:id", (req, res) => {
  const project = req;
  const id = req.params.id;
  db.remove(id)
    .then(result => {
      if (result > 0) {
        res.status(202).json({ message: "Project has been deleted" });
      } else {
        res
          .status(400)
          .json({ error: "Could not delete project with given ID" });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "Server could not delete that project" });
    });
});

function validateProjectId(req, res, next) {
  const id = req.params.id;

  db.get(id)
    .then(resource => {
      if (resource) {
        next();
      } else {
        res.status(400).json({ message: "Project with that ID is not found" });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "Server Error" });
    });
}

module.exports = router;
