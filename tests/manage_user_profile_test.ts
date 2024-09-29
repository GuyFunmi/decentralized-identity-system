import { describe, it, expect, beforeEach } from 'vitest';
import { Chain, Account, types } from '@clarinet/core';

describe('User Profile Contract', () => {
  let chain: Chain;
  let deployer: Account;
  let user1: Account;
  let user2: Account;

  beforeEach(async () => {
    chain = await Chain.new();
    [deployer, user1, user2] = chain.accounts;
  });

  it('should allow a user to set their profile', () => {
    const bio = 'This is my bio';
    const avatarUrl = 'https://example.com/avatar.jpg';
    const socialLinks = ['https://twitter.com/user', 'https://github.com/user'];

    const receipt = chain.execute(tx => {
      tx.from(user1);
      tx.callPublic('user-profile', 'set-profile', [
        types.utf8(bio),
        types.some(types.ascii(avatarUrl)),
        types.list(socialLinks.map(link => types.ascii(link)))
      ]);
    });

    receipt.result.expectOk();
  });

  it('should allow a user to get their profile', () => {
    const bio = 'This is my bio';
    const avatarUrl = 'https://example.com/avatar.jpg';
    const socialLinks = ['https://twitter.com/user', 'https://github.com/user'];

    chain.execute(tx => {
      tx.from(user1);
      tx.callPublic('user-profile', 'set-profile', [
        types.utf8(bio),
        types.some(types.ascii(avatarUrl)),
        types.list(socialLinks.map(link => types.ascii(link)))
      ]);
    });

    const receipt = chain.execute(tx => {
      tx.callReadOnly('user-profile', 'get-profile', [types.principal(user1.address)]);
    });

    const profile = receipt.result.expectSome().expectTuple();
    expect(profile.bio).toEqual(types.utf8(bio));
    expect(profile['avatar-url'].expectSome()).toEqual(types.ascii(avatarUrl));
    expect(profile['social-links'].expectList()).toEqual(socialLinks.map(link => types.ascii(link)));
  });

  it('should allow a user to delete their profile', () => {
    chain.execute(tx => {
      tx.from(user1);
      tx.callPublic('user-profile', 'set-profile', [
        types.utf8('Bio'),
        types.some(types.ascii('Avatar')),
        types.list([types.ascii('Link')])
      ]);
    });

    const deleteReceipt = chain.execute(tx => {
      tx.from(user1);
      tx.callPublic('user-profile', 'delete-profile', []);
    });

    deleteReceipt.result.expectOk();

    const getReceipt = chain.execute(tx => {
      tx.callReadOnly('user-profile', 'get-profile', [types.principal(user1.address)]);
    });

    getReceipt.result.expectNone();
  });

  it('should correctly report if a user has a profile', () => {
    const hasProfileBefore = chain.execute(tx => {
      tx.callReadOnly('user-profile', 'has-profile', [types.principal(user1.address)]);
    });

    hasProfileBefore.result.expectBool(false);

    chain.execute(tx => {
      tx.from(user1);
      tx.callPublic('user-profile', 'set-profile', [
        types.utf8('Bio'),
        types.some(types.ascii('Avatar')),
        types.list([types.ascii('Link')])
      ]);
    });

    const hasProfileAfter = chain.execute(tx => {
      tx.callReadOnly('user-profile', 'has-profile', [types.principal(user1.address)]);
    });

    hasProfileAfter.result.expectBool(true);
  });
});