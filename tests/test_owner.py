import brownie


def test_owner_can_transfer_token(congress, pelosi, mcconnell, minted_schumer):
    congress.transferFrom(pelosi, mcconnell, minted_schumer, {"from": pelosi})

    assert congress.ownerOf(minted_schumer) == mcconnell


def test_nonowner_cannot_transfer_token(congress, minted_schumer, mcconnell, pelosi):
    with brownie.reverts():
        congress.transferFrom(pelosi, mcconnell, minted_schumer, {"from": mcconnell})


def test_nonowner_cannot_mint(congress, mcconnell):
    with brownie.reverts("No Insurrection"):
        congress.mintMOC(
            "schumer", "NYSEN1", "{ipfs_metadata_schumer}", {"from": mcconnell}
        )


def test_can_transfer_contract_owner(congress, pelosi, mcconnell):
    congress.newOwner(mcconnell, {"from": pelosi})
    mint = congress.mintMOC(
        "schumer", "NYSEN1", "{ipfs_metadata_schumer}", {"from": mcconnell}
    )
    assert mint.return_value > 0
