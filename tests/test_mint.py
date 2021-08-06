from brownie import *

def test_can_mint(congress, pelosi):
    ret = congress.mintMOC('schumer', 'NYSEN1', '{}', {'from': pelosi})
    assert ret.return_value > 0

def test_id_initially_zero(congress):
    assert congress.currentId() == 0

def test_id_increments(congress, pelosi):
    ret = congress.mintMOC('schumer', 'NYSEN1', '{schumeripfs}', {'from': pelosi})
    assert congress.currentId() == 1

def test_id_increments_twice(congress, pelosi):
    ret = congress.mintMOC('schumer', 'NYSEN1', '{schumeripfs}', {'from': pelosi})
    ret = congress.mintMOC('aoc', 'NY14', '{aocipfs}', {'from': pelosi})
    assert congress.currentId() == 2



