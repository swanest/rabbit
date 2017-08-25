import { Messaging } from '../Messaging';
import { expect } from 'chai';

describe('Status', () => {

    it('should get the status of one current service (slower than when multiple)', async function () {
        this.timeout(4000);
        const me = new Messaging('me');
        await Promise.all(Messaging.instances.map(i => i.connect())).then(() => new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, 1000);
        }));
        const status = await me.getStatus();
        expect(status).to.include.keys('hasMaster', 'hasReadyMembers', 'members');
        expect(status.members).to.have.lengthOf(1);
        status.members.forEach(e => expect(e.name).to.equal('me'));
    });

    it('should get the status of the current service', async function () {
        const me = new Messaging('me');
        const me2 = new Messaging('me');
        await Promise.all(Messaging.instances.map(i => i.connect())).then(() => new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, 1000);
        }));
        const status = await me.getStatus();
        expect(status).to.include.keys('hasMaster', 'hasReadyMembers', 'members');
        expect(status.members).to.have.lengthOf(2);
        status.members.forEach(e => expect(e.name).to.equal('me'));
    });

    it('should get the status of a foreign service', async function () {
        new Messaging('someone');
        new Messaging('someone');
        const c = new Messaging('client');
        await Promise.all(Messaging.instances.map(i => i.connect())).then(() => new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 1000);
        }));
        const status = await c.getStatus('someone');
        expect(status).to.include.keys('hasMaster', 'hasReadyMembers', 'members');
        expect(status.members).to.have.lengthOf(2);
        status.members.forEach(e => expect(e.name).to.equal('someone'));
    });
});
