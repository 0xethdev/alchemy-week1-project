import { useState } from "react";
import server from "./server";
import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { toHex }from 'ethereum-cryptography/utils';

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [signature, setSignature] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);


  async function transfer(evt) {
    evt.preventDefault();
    let publicKey = toHex(secp256k1.getPublicKey(signature));
    
    if(address === publicKey){
      try {
        const {
          data: { balance },
        } = await server.post(`send`, {
          sender: publicKey,
          amount: parseInt(sendAmount),
          recipient,
        });
        setBalance(balance);
        setSignature('Transfer Successful!')
        } catch (ex) {
        alert(ex.response.data.message);
      }
      }else{
        setSignature('Signature does not match your wallet address, please try again.');
      }
    }
    

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <label>
        Signature
        <input
          placeholder="Type key for signature, for example: 0x2"
          value={signature}
          onChange={setValue(setSignature)}
        ></input>
      </label>

      <input type="submit" className="button" value="Sign & Transfer" />
    </form>
  );
}

export default Transfer;
