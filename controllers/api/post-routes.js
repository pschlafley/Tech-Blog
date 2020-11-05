const router = require('express').Router();
const { User, Post } = require('../../models');

router.get('/', (req, res) => {
    Post.findAll({
        attributes: [
            'id',
            'title',
            'text_area',
            'created_at',
            'user_id'
        ]
    })
    .then(dbPostData => {res.json(dbPostData)})
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

router.get('/:id', (req, res) => {
    Post.findOne({
        attributes: [
            'id', 
            'title', 
            'text_area', 
            'created_at',
            'user_id'
        ],
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData => {
        if(!dbPostData) {
            res.status(404).json({ message: "No post found with that id" });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

router.post('/', (req, res) => {
    Post.create({
        title: req.body.title,
        text_area: req.body.text_area,
        reference_url: req.body.reference_url,
        user_id: req.body.user_id
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

module.exports = router;