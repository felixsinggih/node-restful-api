import supertest from "supertest";
import { logger } from "../src/application/logging.js";
import { web } from "../src/application/web.js";
import { removeTestUser } from "./test-util.js";

describe('POST /api/users', function () {
    afterEach(async () => {
        await removeTestUser();
    })

    it('should can register new user', async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                username: 'felix',
                password: 'password',
                name: 'Felix Singgih'
            });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("felix");
        expect(result.body.data.name).toBe("Felix Singgih");
        expect(result.body.data.password).toBeUndefined();
    });

    it('should reject if request is invalid', async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                username: '',
                password: '',
                name: ''
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if username already registered', async () => {
        let result = await supertest(web)
            .post('/api/users')
            .send({
                username: 'felix',
                password: 'password',
                name: 'Felix Singgih'
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("felix");
        expect(result.body.data.name).toBe("Felix Singgih");
        expect(result.body.data.password).toBeUndefined();

        result = await supertest(web)
            .post('/api/users')
            .send({
                username: 'felix',
                password: 'password',
                name: 'Felix Singgih'
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
})