const assert = require('assert');
const ganache =  require ('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const {  interface, bytecode } = require('../compile');

let lottery;
let accounts;

beforeEach( async () => {
    accounts  = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy ({ data: bytecode })
    .send ({ from: accounts[0] , gas: '1000000'  });



});

describe ("lotter contract", ()=>{
    it('deployes a contract', ()=>{
        assert.ok(lottery.options.address);

    });

    // test to check if the one can enter lottery

    it('enters the lottery', async ()=>{
        await lottery.methods.enter().send({
            from: accounts[0],
            //web3 librally provides us with a way of converting 
            // wei to ether directly using the  below code
            value : web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from : accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length)
    } );

    // testing multiple accounts

    it('registers two accounts', async ()=>{
        await lottery.methods.enter().send({
            from: accounts[0],
            value : web3.utils.toWei('0.03', 'ether')

        });
        await lottery.methods.enter().send({
            from: accounts[1],
            value : web3.utils.toWei('0.03', 'ether')

        });
        await lottery.methods.enter().send({
            from: accounts[2],
            value : web3.utils.toWei('0.03', 'ether')

        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(3, players.length);

    });

    // making sure someone sends the correct amount of ether

    it('requires minimum amount of ether to enter', async() =>{
      
        try {
            await lottery.methods.enter().send({
                from:  accounts[0],
                value: 200
            });

            assert(false);
    
            
        } catch (error) {
            assert(error);
            
        }

        // a test to make sure only the manager can pick a winner

        it('only manager can access the get wwinner call', async () => {

                try {
                    await lottery.methods.pickWinner().send({
                       from : accounts[1] 
                    });
                    assert(false)
                } catch (error) {
                    assert(error);
                    
                }
            
            
        });
    });

    // a test that test every function in our code from top to bottom

    it('can run from end to end', async ()=>{
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')

        });
        //getBalance function return the number of weis in the account

        const initialBalance = await web3.eth.getBalance(accounts[0]);

        await lottery.methods.pickWinner().send({
            from: accounts[0]

        });

        const finalbalance = await web3.eth.getBalance(accounts[0]);

        const  difference = finalbalance - initialBalance;
        console.log(difference);
        
        assert(difference> web3.utils.toWei('1.8', 'ether'));


    });

});