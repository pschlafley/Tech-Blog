const router = require('express').Router();
const { User, Post, Comment } = require('../../models');


router.get('/', (req, res) => {
    User.findAll({
        attributes: {
            exclude: ['password']
        }
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        res.status(500).json(err)
    })
});

router.get('/:id', (req, res) => {
    User.findOne({
          attributes: {
            exclude: ['password']
        },
        where: {
            id: req.params.id
        },
        include: [
            {
                attributes: {
                    exclude: ['user_id', 'updatedAt']
                },
                model: Post,
                include: [
                    {
                        model: Comment,
                        attributes: ['text_area', 'post_id', 'user_id']
                    }
                ]
            }
        ]
    })
    .then(dbUserData => {
        if(!dbUserData){
            res.status(404).json({ message: 'No user found with that id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

router.post('/', (req, res) => {
    User.create(
        {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        }
    )
    .then(createdUser => res.json(createdUser))
    .catch(err => {
        res.status(500).json(err)
    })
});

router.put('/:id', (req, res) => {
    User.update(req.body, {
        individualHooks: true, 
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if(!dbUserData[0]){
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData)
    })
    .catch(err => {
        res.status(500).json(err)
    })
});

router.delete('/:id', (req, res) => {
    User.destroy(
        {
            where: {
                id: req.params.id
            }
        }
    )
    .then(dbUserData => {res.json(dbUserData)})
    .catch(err => {
        res.status(500).json(err)
    })
});

module.exports = router;