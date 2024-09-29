import { Clarinet, Tx, Chain, Account, types } from "@hirosystems/clarinet-sdk";
import { describe, it, expect, beforeEach } from "vitest";

describe("Decentralized Identity System", () => {
  let wallet_1: Account;
  let wallet_2: Account;

  beforeEach(() => {
    const accounts = Chain.getAccounts();
    wallet_1 = accounts.get("wallet_1")!;
    wallet_2 = accounts.get("wallet_2")!;
  });

  it("should create an identity", () => {
    const { result } = Chain.mineBlock([
      Tx.contractCall("identity-system", "create-identity", [
        types.ascii("Alice"),
        types.ascii("alice@example.com")
      ], wallet_1.address)
    ]);

    expect(result).toBeOk(types.uint(1));
  });

  it("should not allow creating multiple identities for the same user", () => {
    Chain.mineBlock([
      Tx.contractCall("identity-system", "create-identity", [
        types.ascii("Alice"),
        types.ascii("alice@example.com")
      ], wallet_1.address)
    ]);

    const { result } = Chain.mineBlock([
      Tx.contractCall("identity-system", "create-identity", [
        types.ascii("Alice2"),
        types.ascii("alice2@example.com")
      ], wallet_1.address)
    ]);

    expect(result).toBeErr(types.uint(100));
  });

  it("should get an identity", () => {
    Chain.mineBlock([
      Tx.contractCall("identity-system", "create-identity", [
        types.ascii("Bob"),
        types.ascii("bob@example.com")
      ], wallet_2.address)
    ]);

    const { result } = Chain.mineBlock([
      Tx.contractCall("identity-system", "get-identity", [
        types.principal(wallet_2.address)
      ], wallet_1.address)
    ]);

    expect(result).toBeOk(types.some(
      types.tuple({
        id: types.uint(1),
        name: types.ascii("Bob"),
        email: types.ascii("bob@example.com")
      })
    ));
  });

  it("should update an identity", () => {
    Chain.mineBlock([
      Tx.contractCall("identity-system", "create-identity", [
        types.ascii("Charlie"),
        types.ascii("charlie@example.com")
      ], wallet_1.address)
    ]);

    const { result } = Chain.mineBlock([
      Tx.contractCall("identity-system", "update-identity", [
        types.ascii("Charles"),
        types.ascii("charles@example.com")
      ], wallet_1.address)
    ]);

    expect(result).toBeOk(types.bool(true));

    const { result: getResult } = Chain.mineBlock([
      Tx.contractCall("identity-system", "get-identity", [
        types.principal(wallet_1.address)
      ], wallet_1.address)
    ]);

    expect(getResult).toBeOk(types.some(
      types.tuple({
        id: types.uint(1),
        name: types.ascii("Charles"),
        email: types.ascii("charles@example.com")
      })
    ));
  });

  it("should not update a non-existent identity", () => {
    const { result } = Chain.mineBlock([
      Tx.contractCall("identity-system", "update-identity", [
        types.ascii("Dave"),
        types.ascii("dave@example.com")
      ], wallet_2.address)
    ]);

    expect(result).toBeErr(types.uint(101));
  });
});