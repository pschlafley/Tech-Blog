const router = require('express').Router();
const { Post, Comment } = require('../../models');

router.get('/', (req, res) => {
    Post.findAll({
        attributes: [
            'id',
            'title',
            'text_area',
            'reference_url',
            'created_at',
            'user_id'
        ],
        include: [
            {
                model: Comment,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            }
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
            'reference_url',
            'created_at',
            'user_id'
        ],
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Comment,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            }
        ]
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

router.put('/:id', (req, res) => {
    Post.update(req.body, {
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData => {
        if(!dbPostData[0]){
            res.status(404).json({ message: 'No Post found with this id' });
            return;
        }
        res.json(dbPostData)
    })
    .catch(err => {
        res.status(500).json(err)
    })
});

router.delete('/:id', (req, res) => {
    Post.destroy(
        {
            where: {
                id: req.params.id
            }
        }
    )
    .then(dbPostData => {res.json(dbPostData)})
    .catch(err => {
        res.status(500).json(err)
    })
});

module.exports = router;