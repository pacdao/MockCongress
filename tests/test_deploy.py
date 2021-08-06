from brownie import MockCongress, accounts


def test_default_no_nfts(congress):
    assert congress.currentId() == 0


def test_can_deploy(pelosi):
    mc = None
    try:
        mc = MockCongress.deploy(pelosi, {"from": pelosi})
        assert True
    except:
        assert False
