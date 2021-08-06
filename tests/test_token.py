import brownie


def test_can_lookup_username(congress, minted_schumer):
    assert congress.directory(minted_schumer)[0] == "schumer"


def test_can_lookup_seat(congress, minted_schumer):
    assert congress.directory(minted_schumer)[1] == "NYSEN1"


def test_can_lookup_uri(congress, minted_schumer):
    assert congress.tokenURI(minted_schumer) == "{ipfs_metadata_schumer}"


def test_seat_lookup(congress, minted_schumer, minted_aoc):
    seat_id = congress.lookupIdFromSeat("NYSEN1")
    assert minted_schumer == seat_id

    seat_id = congress.lookupIdFromSeat("NY14")
    assert minted_aoc == seat_id


def test_update_username(congress, minted_schumer, pelosi):
    congress.updateUsername(minted_schumer, "chucky", {"from": pelosi})
    assert congress.directory(minted_schumer)[0] == "chucky"


def test_nonowner_cannot_update_username(congress, minted_schumer, pelosi, mcconnell):
    with brownie.reverts("Wrong Puppeteer"):
        congress.updateUsername(minted_schumer, "chucky", {"from": mcconnell})
    assert congress.directory(minted_schumer)[0] == "schumer"


def test_cannot_lookup_bogus_id(congress, minted_schumer, minted_aoc):
    current_id = congress.currentId()
    assert congress.directory(current_id + 1) == ("", "")


def test_cannot_lookup_bogus_seat(congress, minted_schumer, minted_aoc):
    assert congress.lookupIdFromSeat("MASEN") == 0
