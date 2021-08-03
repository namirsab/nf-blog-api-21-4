const express = require("express");
const Article = require("../models/article");

const router = express.Router();

function validateRequest(req, res, next) {
  if (!req.body.title) {
    res.status(400).json({
      error: "Request body must contain a title property",
    });
    return;
  }
  if (!req.body.body) {
    res.status(400).json({
      error: "Request body must contain a body property",
    });
    return;
  }

  next();
}

router.get("/", (req, res) => {
  Article.find({})
    .populate("author")
    .then((articles) => {
      res.send(articles);
    })
    .catch(() => {
      res.status(500);
      res.json({
        error: "Something went wrong, please try again later",
      });
    });
});

router.post("/", validateRequest, (req, res) => {
  Article.create(req.body)
    .then((newArticle) => {
      res.status(201).send(newArticle);
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        res.status(400).json(error);
      }
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  Article.findById(id)
    .populate("author")
    .then((article) => {
      if (!article) {
        res.status(404).end();
        return;
      }
      res.send(article);
    })
    .catch(() => {
      res.status(500);
      res.json({
        error: "Something went wrong, please try again later",
      });
    });
});

router.patch("/:id", (req, res) => {
  const { id } = req.params;

  Article.findByIdAndUpdate(id, req.body, { new: true })
    .populate("author")
    .then((updatedPost) => {
      if (!updatedPost) {
        res.status(404).end();
        return;
      }
      res.send(updatedPost);
    })
    .catch(() => {
      res.status(500);
      res.json({
        error: "Something went wrong, please try again later",
      });
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  Article.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end();
    })
    .catch(() => {
      res.status(500);
      res.json({
        error: "Something went wrong, please try again later",
      });
    });
});

module.exports = router;
