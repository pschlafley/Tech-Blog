const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', (req, res) => {
    Post.findAll({
        order: [['created_at', 'DESC']],
        attributes: [
            'id',
            'title',
            'text_area',
            'reference_url',
            'created_at'
        ],
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Comment,
                attributes: {
                    exclude: ['updatedAt', 'user_id', 'post_id']
                },
                include: [
                    {
                        model: User,
                        attributes: ['id', 'username']
                    }
                ]
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
            'created_at'
        ],
        where: {
            id: req.params.id
        },
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Comment,
                attributes: {
                    exclude: ['updatedAt', 'user_id', 'post_id']
                },
                include: [
                    {
                        model: User, 
                        attributes: ['id','username']
                    }
                ]
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

router.post('/', withAuth, (req, res) => {
    if(req.session) {
        Post.create({
            title: req.body.title,
            text_area: req.body.text_area,
            reference_url: req.body.reference_url,
            user_id: req.session.user_id
        })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    }
});

router.put('/:id', withAuth, (req, res) => {
    Post.update(req.body, {
        title: req.body.title,
        text_area: req.body.text_area,
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

router.delete('/:id', withAuth, (req, res) => {
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