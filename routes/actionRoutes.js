const express = require("express");
const db = require("../data/helpers/actionModel");
const projectDB = require("../data/helpers/projectModel");
const router = express.Router();

router.get("/", (req, res) => {
  db.get()
    .then(resources => {
      res.status(200).json(resources);
    })
    .catch(err => {
      res.status(500).json({ error: "Server error getting list of actions" });
    });
});

// Get actions based on project ID
router.get("/:id", (req, res) => {
  const id = req.params.id;
  projectDB
    .getProjectActions(id)
    .then(resource => {
      if (resource.length === 0) {
        res
          .status(400)
          .json({ error: "Could not find any actions under that ID" });
      } else {
        res.status(200).json(resource);
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "Server could not get the given projects....actions" });
    });
});

// Post action to project ID
router.post("/:id", validatePostLength, (req, res) => {
  const id = req.params.id;
  const body = req.body;
  body.project_id = id;
  db.insert(body)
    .then(resource => {
      res.status(200).json(resource);
    })
    .catch(err => {
      res.status(500).json({ error: "Server could not post action" });
    });
});

router.put("/:id", validatePostLength, (req, res) => {
  const id = req.params.id;
  const updatedAction = req.body;

  db.get(id)
    .then(resource => {
      console.log(resource);
      updatedAction.project_id = resource.project_id;
      db.update(id, updatedAction)
        .then(resource => {
          res.status(200).json(resource);
        })
        .catch(err => {
          res.status(500).json({ message: "Server Error" });
        });
    })
    .catch(err => {
      res.status(500).json({ message: "Could not get ID" });
    });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  db.get(id)
    .then(resource => {
      db.remove(resource.id)
        .then(resource => {
          res.status(200).json(resource);
        })
        .catch({
          error: "Server could not delete the action with that ID given"
        });
    })
    .catch({ error: "Sever can not get that ID" });
});

function validatePostLength(req, res, next) {
  const description = req.body.description;
  const notes = req.body.notes;

  if (notes.length === 0) {
    res.status(404).json({ message: "Notes section required" });
  } else if (description.length > 128) {
    res
      .status(400)
      .json({ messgae: "Your description is too long fix it..now!" });
  } else {
    next();
  }
}

module.exports = router;
