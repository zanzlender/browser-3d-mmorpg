# AGENT 5 - NPC 4

from spade.agent import Agent
from spade.behaviour import CyclicBehaviour
from spade import quit_spade
import time
from ast import literal_eval
import math

welcomeMessage = "Pozdrav igraču! Dobrodošao u moj dućan gdje se sve može kupiti!"
incorrectMessage = "Pošalji Hi da bi popričao sa NPCjem 4."
gameResetMessage = "IGRA JE RESETIRANA\n\n"
availableQuestions = [
  {
    "trigger": "A",
    "question": "A: Što imaš u ponudi?",
    "answer": "Imam predivnu selekciju novčića, ali morat ćeš mi dati neku ponudu!"
  },
  {
    "trigger": "B",
    "question": "B: Kako ti dajem ponudu?",
    "answer": "Pošalji poruku NUDIM=TVOJ_BROJ a ja ću ti poslati da li prihvaćam ili što ja nudim. Ako zeliš prihvatiti ponudu pošalji PRIHVACAM."
  },
]

questionsString = ""

for question in availableQuestions: 
  questionsString += question.get("question") + "\n"


class Agent_NPC4(Agent):  
  class ReceiveAnswerMessages(CyclicBehaviour): 
    async def on_start(self):
      self.agent.offerComplete = False
      self.agent.offerRounds = 0
      self.agent.offer = 0
      self.agent.receivedOffer = 0
      print("AGENT 5 - NPC4 initialized!\n\n")

    async def on_end(self):
      print("\nAGENT 5 - NPC4 decommissioned!\n\n")
      
    async def run(self): 
      msg = await self.receive(timeout=10)
      
      if(msg):
        print(f"Received message: {msg.body}")
        
        newMessage = msg.make_reply()
        foundMatch = False
        
        if(msg.body == "Hi"):
          foundMatch = True
          newMessage.body = welcomeMessage + "\n\n" + questionsString
          await self.send(newMessage)
        elif(msg.body == "PRIHVACAM"): 
          if(self.agent.offerComplete == True):
            newMessage.body = "Nažalost nemam više ponuda za tebe..." 
            await self.send(newMessage)
          else:
            self.agent.offerComplete = True
            foundMatch = True
            newMessage.body = "Bilo mi je drago pregovarati sa tobom, izvoli " + str(self.agent.offer) + " novčića." + "  RECEIVED_COINS=" + str(self.agent.offer) + ":::GIVEN_COINS=" + str(self.agent.receivedOffer)
            await self.send(newMessage)
        elif(msg.body == "RESET_GAME"):
          self.agent.offerComplete = False
          self.agent.offerRounds = 0
          self.agent.offer = 0
          self.agent.receivedOffer = 0
          
          newMessage.body = gameResetMessage
          await self.send(newMessage)
        if(msg.body.find("NUDIM") != -1):
          foundMatch = True
          
          if(self.agent.offerComplete == True):
            newMessage.body = "Nažalost nemam više ponuda za tebe..." 
            await self.send(newMessage)
          else:
            playerOffer = self.interpretMessage(msg.body)
            newOffer = self.generateOffer(playerOffer)
            newMessage.body = "Ja ti nudim " + str(newOffer) + " za tvojih " + str(playerOffer)
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
           
    def interpretMessage(self, message):
      offer = message.split("=")[1]
      offer = int(offer) 
      
      return offer   

    def generateOffer(self, offer):
      counterOffer = 0
      
      if(offer > 3):
        counterOffer = 3
        
      counterOffer = math.floor(offer * (0.8 + (0.2 * self.agent.offerRounds)))
      
      if(counterOffer > 7):
        counterOffer = 7
    
      self.agent.offerRounds += 1
      self.agent.receivedOffer = offer
      self.agent.offer = counterOffer
      return counterOffer
         
  async def setup(self):
    fsm = self.ReceiveAnswerMessages()
    self.add_behaviour(fsm)

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

if __name__ == "__main__":
  agent_NPC4 = Agent_NPC4('zzlen-agent-5@5222.de', '9"Xp^NCDcLzh>-j')
  agentInit = agent_NPC4.start()
  agentInit.result()
  agent_NPC4.web.start(hostname="127.0.0.1", port="12348")

  while agent_NPC4.is_alive():
    try:
      time.sleep(1)
    except KeyboardInterrupt:
      break

  agent_NPC4.stop()
  quit_spade()
        