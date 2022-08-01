import { client } from '../../lib/sanity'

const sendMessagesOnSanity = async (req, res) => {
  try {
    const userDoc = {
      _type: 'msg',
      _id: req.body.userWalletAddress,
      name: req.body.name,
      walletAddress: req.body.userWalletAddress,
    }

    await client.createIfNotExists(userDoc)

    res.status(200).send({ message: 'success' })
  } catch (error) {
    res.status(500).send({ message: 'error', data: error.message })
  }
}

export default sendMessagesOnSanity;