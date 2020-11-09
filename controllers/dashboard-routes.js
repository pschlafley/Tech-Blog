const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const router = require('express').Router();
const withAuth = require('../utils/auth');

router.get('/', withAuth, (req, res) => {
    Post.findAll({
        order: [['created_at', 'DESC']],
        where: {
            user_id: req.session.user_id
        },
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
    .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({ plain: true  }));
        res.render('dashboard', {
            posts, 
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: [
        'id',
        'reference_url',
        'title',
        'created_at',
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
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
  
        // serialize the data
        const post = dbPostData.get({ plain: true });
  
        // pass data to template
        res.render('edit-post', { 
            post, 
            loggedIn: req.session.loggedIn
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  }); 

module.exports = router;