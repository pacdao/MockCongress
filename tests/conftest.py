import pytest
from brownie import *


@pytest.fixture(scope="function", autouse=True)
def isolate(fn_isolation):
    # perform a chain rewind after completing each test, to ensure proper isolation
    # https://eth-brownie.readthedocs.io/en/v1.10.3/tests-pytest-intro.html#isolation-fixtures
    pass


@pytest.fixture(scope="module")
def congress():
    return MockCongress.deploy(accounts[0], {"from": accounts[0]})


@pytest.fixture(scope="module")
def pelosi():
    return accounts[0]


@pytest.fixture(scope="module")
def mcconnell():
    return accounts[1]


@pytest.fixture(scope="module")
def minted_schumer(congress, pelosi):
    ret = congress.mintMOC(
        "schumer", "NYSEN1", "{ipfs_metadata_schumer}", {"from": pelosi}
    )
    return ret.return_value


@pytest.fixture(scope="module")
def minted_aoc(congress, pelosi):
    ret = congress.mintMOC("aoc", "NY14", "{ipfs_metadata_aoc}", {"from": pelosi})
    return ret.return_value
