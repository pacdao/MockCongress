from brownie import *


def main():
    deploy_acct = accounts.load("ropsten")
    mc = MockCongress.deploy(accounts[0], {"from": accounts[0]}, publish_source=True)
    return mc
