const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app');

describe('GET /apps', () => {
    it('should return an array of apps', () => {
        return request(app)
                .get('/apps')
                .expect(200)
                .expect('Content-Type', /json/)
                .then(res => {
                    expect(res.body).to.be.an('array')
                    expect(res.body).to.have.lengthOf.at.least(1);

                    const app = res.body[0];
                    expect(app).to.have.keys('App', 'Category', 'Rating', 'Reviews', 'Size', 'Installs', 'Type', 'Price', 'Content Rating', 'Genres', 'Last Updated', 'Current Ver', 'Android Ver');
                })
    })

    it('should be 400 if sort is incoorect', () => {
        return request(app)
                .get('/apps')
                .query({ sort: "MISTAKE" })
                .expect(400, "Sort must be one of rating or app.")
    });

    it('should sort by rating', () => {
        return request(app)
                .get('/apps')
                .query({sort: 'rating'})
                .expect(200)
                .expect('Content-Type', /json/)
                .then(res => {
                    expect(res.body).to.be.an('array')

                    let i = 0;
                    let sorted = true;
                    while(sorted && i < res.body.length - 1) {
                        sorted = sorted && res.body[i]["Rating"] >= res.body[i + 1]["Rating"]
                        i++;
                    }
                    expect(sorted).to.be.true;
                })
    });

    it('should sort by app', () => {
        return request(app)
                .get('/apps')
                .query({sort: 'app'})
                .expect(200)
                .expect('Content-Type', /json/)
                .then(res => {
                    expect(res.body).to.be.an('array')

                    let i = 0;
                    let sorted = true;
                    while(sorted && i < res.body.length - 1) {
                        sorted = sorted && res.body[i]["App"] < res.body[i + 1]["App"]
                        i++;
                    }
                    expect(sorted).to.be.true;
                })
    });

    it('should be 400 if genre is incoorect', () => {
        return request(app)
                .get('/apps')
                .query({ genres: "MISTAKE" })
                .expect(400, "Sort must be one of Action, Puzzle, Strategy, Casual, Arcade or Card.")
    });

    it('should only show the apps with a specifc genre', () => {
        return request(app)
                .get('/apps')
                .query( {genres: 'action'} )
                .expect(200)
                .expect('Content-Type', /json/)
                .then(res => {
                    expect(res.body).to.be.an('array');
                    // const apps = res.body
                    let i = 0;
                    let action = true;
                    while (action && i < res.body.length -1 ) {
                        action = action && res.body[i]["Genres"].includes('Action');
                        i++;
                    }
                    expect(action).to.be.true;
                })
    })
})