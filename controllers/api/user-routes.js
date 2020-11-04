const router = require('express').Router();
const { User, Post } = require('../../models');


router.get('/', (req, res) => {
    User.findAll({
        // attributes: {
        //     exclude: ['password']
        // }
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        res.status(500).json(err)
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

module.exports = router;