# AGENT 3 - NPC 2

from spade.agent import Agent
from spade.behaviour import CyclicBehaviour
from spade import quit_spade
import time
from spade.message import Message

welcomeMessage = "Predivan je dan i baš se osjećam darežljivo, a ti? :)"
incorrectMessage = "Pošalji Hi da bi popričao sa NPCjem 2."
gameResetMessage = "IGRA JE RESETIRANA\n\n"
maxCoins = 3
availableQuestions = [
  {
    "trigger": "A",
    "question": "A: Drago mi je da si tako veseo, koja je prigoda?",
    "answer": "Ne znam samo me puklo tako danas!"
  },
  {
    "trigger": "B",
    "question": "B: Meni nažalost nije tako lijepo... Siromašan sam i nemam novaca... Možeš li mi dati novčić?",
    "answer": "Ma naravno, izvoli 1 novčić",
    "coins": 1,
    "hitLimitMessage": "Sorry prijatelju ali sreća me lagano prolazi..."
  },
]
questionsString = ""

for question in availableQuestions: 
  questionsString += question.get("question") + "\n"

class Agent_NPC2(Agent):  
  class ReceiveAnswerMessages(CyclicBehaviour): 
    async def on_start(self):
      print("AGENT 3 - NPC2 initialized!\n\n")
      self.agent.coinCounter = 0
      self.agent.sentPlayerData = False

    async def on_end(self):
      print("\nAGENT 3 - NPC2 decommissioned!\n\n")
      
    async def run(self): 
      msg = await self.receive(timeout=10)
      
      if(msg):
        print(f"Received message: {msg.body}")
        
        newMessage = msg.make_reply()
        foundMatch = False
        
        if(msg.body == "Hi"):
          foundMatch = True
          newMessage.body = welcomeMessage + "\n\n" + questionsString
        elif(msg.body == "RESET_GAME"):
          foundMatch = True
          self.agent.coinCounter = 0
          self.agent.sentPlayerData = False
          newMessage.body = gameResetMessage
        else: 
          for question in availableQuestions: 
            if(question.get("trigger") == msg.body):
              foundMatch = True
              coins = question.get("coins", 0)
                 
              if(coins > 0):
                if(self.agent.coinCounter < maxCoins):
                  self.agent.coinCounter += coins
                  newMessage.body = question.get("answer") + "  RECEIVED_COINS=" + str(coins)
                else: 
                  newMessage.body += question.get("hitLimitMessage")
                  if(self.agent.sentPlayerData == False):
                    agentMsg = Message()
                    agentMsg.sender = "zzlen-agent-2@5222.de"
                    agentMsg.to = "zzlen-agent-6@5222.de"
                    agentMsg.body = "COMPLETE"
                    await self.send(agentMsg)
              else: 
                newMessage.body = question.get("answer")
              
        if(foundMatch == False):
          newMessage.body = incorrectMessage    
      
        await self.send(newMessage)
                
  async def setup(self):
    fsm = self.ReceiveAnswerMessages()
    self.add_behaviour(fsm)

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

if __name__ == "__main__":
  agent_NPC2 = Agent_NPC2('zzlen-agent-3@5222.de', '9"Xp^NCDcLzh>-j')
  agentInit = agent_NPC2.start()
  agentInit.result()
  agent_NPC2.web.start(hostname="127.0.0.1", port="12346")

  while agent_NPC2.is_alive():
    try:
      time.sleep(1)
    except KeyboardInterrupt:
      break

  agent_NPC2.stop()
  quit_spade()
        