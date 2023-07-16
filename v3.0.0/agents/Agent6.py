# AGENT 6 - NPC 5

from spade.agent import Agent
from spade.behaviour import CyclicBehaviour
from spade import quit_spade
import time
from ast import literal_eval

blockedMessage = "Pozdrav igraču! Nisi još dovoljno moćan da bi razgovarao sa mnom."
welcomeMessage = "Pozdrav igraču! Puno si proputovao i putovanje ti se bliži kraju...."
incorrectMessage = "Pošalji Hi da bi popričao sa NPCjem 5."
gameResetMessage = "IGRA JE RESETIRANA\n\n"
agentsInteractionCriteria = [
  {
    "agent": "zzlen-agent-2@5222.de",
    "complete": False
  },
  {
    "agent": "zzlen-agent-3@5222.de",
    "complete": False
  },
  {
    "agent": "zzlen-agent-4@5222.de",
    "complete": False
  },
]
availableQuestions = [
  {
    "trigger": "A",
    "question": "A: Tko si ti?",
    "answer": "Ja sam veliki matematičar koji ispunjava želje! Ako riješiš ovu jednadžbu onda ću te nagraditi! 7x = 49, koliki je x?"
  },
  {
    "trigger": "B",
    "question": "B: Kako ti mogu poslati odgovor?",
    "answer": "Pošalji poruku RJESENJE=TVOJE_RJESENJE."
  },
]

questionsString = ""

for question in availableQuestions: 
  questionsString += question.get("question") + "\n"


class Agent_NPC5(Agent):  
  class ReceiveAnswerMessages(CyclicBehaviour): 
    async def on_start(self):
      self.agent.agentsInteractionCriteria = agentsInteractionCriteria
      self.agent.sentCoins = False
      print("AGENT 6 - NPC5 initialized!\n\n")

    async def on_end(self):
      print("\nAGENT 6 - NPC5 decommissioned!\n\n")
      
    async def run(self): 
      msg = await self.receive(timeout=10)
      
      if(msg):
        print(f"Received message: {msg.body}")

        # other agent's data
        if(str(msg.sender.bare()) in ["zzlen-agent-2@5222.de", "zzlen-agent-3@5222.de", "zzlen-agent-4@5222.de"]):
          for index, el in enumerate(self.agent.agentsInteractionCriteria):
            if (el.get("agent", "") == str(msg.sender.bare())):
              print("Recevied agent data: " + msg.body)
              self.agent.agentsInteractionCriteria[index].update({"complete": True})
        else: 
          criteriaFulfilled = True
          
          for agent in self.agent.agentsInteractionCriteria:
            if agent.get("complete") == False:
              criteriaFulfilled = False
          
          newMessage = msg.make_reply()
          foundMatch = False
          
          if(msg.body == "RESET_GAME"):
            newMessage.body = gameResetMessage
            self.agent.agentsInteractionCriteria = agentsInteractionCriteria
            self.agent.sentCoins = False
            await self.send(newMessage)
          
          if(criteriaFulfilled == False):
            foundMatch = True
            newMessage.body = blockedMessage
            await self.send(newMessage)
          
          if(criteriaFulfilled == True):   
            if(msg.body == "Hi"):
              foundMatch = True
              newMessage.body = welcomeMessage + "\n\n" + questionsString
              await self.send(newMessage)
            elif(msg.body.find("RJESENJE=") != -1):
              foundMatch = True
              if(self.agent.sentCoins == False and msg.body.find("RJESENJE=7") != -1):
                self.agent.sentCoins = True
                newMessage.body = "Čestitam, kako si pametan!" + "  RECEIVED_COINS=" + str(3)
                await self.send(newMessage)
              elif(self.agent.sentCoins == False):
                newMessage.body = "Krivo... pokušaj ponovo"
                await self.send(newMessage)
              else:  
                newMessage.body = "Neka je sreća sa tobom mladi igraču!"
                await self.send(newMessage)
         
            else: 
              for question in availableQuestions: 
                if(question.get("trigger") == msg.body):
                  foundMatch = True
                  newMessage.body = question.get("answer")    
                  await self.send(newMessage)  
                           
            if(foundMatch == False):
              newMessage.body = incorrectMessage    
              await self.send(newMessage)
                          
  async def setup(self):
    fsm = self.ReceiveAnswerMessages()
    self.add_behaviour(fsm)

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

if __name__ == "__main__":
  agent_NPC5 = Agent_NPC5('zzlen-agent-6@5222.de', '9"Xp^NCDcLzh>-j')
  agentInit = agent_NPC5.start()
  agentInit.result()
  agent_NPC5.web.start(hostname="127.0.0.1", port="12349")

  while agent_NPC5.is_alive():
    try:
      time.sleep(1)
    except KeyboardInterrupt:
      break

  agent_NPC5.stop()
  quit_spade()
        