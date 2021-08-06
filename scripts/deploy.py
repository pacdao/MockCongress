from brownie import *

def main():
    deploy_acct = accounts[0]
    mc = MockCongress.deploy(accounts[0], {'from': accounts[0]})
    return mc
