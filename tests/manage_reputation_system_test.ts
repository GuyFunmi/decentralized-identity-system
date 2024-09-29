import { describe, it, expect, beforeEach } from 'vitest';
import { Chain, Account, types } from '@clarinet/core';

describe('Reputation System Contract', () => {
  let chain: Chain;
  let deployer: Account;
  let user1: Account;
  let user2: Account;

  beforeEach(async () => {
    chain = await Chain.new();
    [deployer, user1, user2] = chain.accounts;
  });

  it('should initialize a user\'s reputation', () => {
    const receipt = chain.execute(tx => {
      tx.callPublic('reputation-system', 'initialize-reputation', [types.principal(user1.address)]);
    });

    receipt.result.expectOk();

    const getReceipt = chain.execute(tx => {
      tx.callReadOnly('reputation-system', 'get-reputation', [types.principal(user1.address)]);
    });

    const reputation = getReceipt.result.expectSome().expectTuple();
    expect(reputation.score).toEqual(types.int(0));
  });

  it('should not allow initializing reputation twice', () => {
    chain.execute(tx => {
      tx.callPublic('reputation-system', 'initialize-reputation', [types.principal(user1.address)]);
    });

    const receipt = chain.execute(tx => {
      tx.callPublic('reputation-system', 'initialize-reputation', [types.principal(user1.address)]);
    });

    receipt.result.expectErr().expectUint(100);
  });

  it('should update a user\'s reputation within allowed range', () => {
    chain.execute(tx => {
      tx.callPublic('reputation-system', 'initialize-reputation', [types.principal(user1.address)]);
    });

    const receipt = chain.execute(tx => {
      tx.callPublic('reputation-system', 'update-reputation', [types.principal(user1.address), types.int(1)]);
    });

    receipt.result.expectOk();

    const getReceipt = chain.execute(tx => {
      tx.callReadOnly('reputation-system', 'get-reputation', [types.principal(user1.address)]);
    });

    const reputation = getReceipt.result.expectSome().expectTuple();
    expect(reputation.score).toEqual(types.int(1));
  });

  it('should not allow updating reputation outside allowed range', () => {
    chain.execute(tx => {
      tx.callPublic('reputation-system', 'initialize-reputation', [types.principal(user1.address)]);
    });

    const receipt = chain.execute(tx => {
      tx.callPublic('reputation-system', 'update-reputation', [types.principal(user1.address), types.int(2)]);
    });

    receipt.result.expectErr().expectUint(101);
  });

  it('should correctly report if a user has a reputation score', () => {
    const hasReputationBefore = chain.execute(tx => {
      tx.callReadOnly('reputation-system', 'has-reputation', [types.principal(user1.address)]);
    });

    hasReputationBefore.result.expectBool(false);

    chain.execute(tx => {
      tx.callPublic('reputation-system', 'initialize-reputation', [types.principal(user1.address)]);
    });

    const hasReputationAfter = chain.execute(tx => {
      tx.callReadOnly('reputation-system', 'has-reputation', [types.principal(user1.address)]);
    });

    hasReputationAfter.result.expectBool(true);
  });
});