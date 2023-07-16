# AGENT 2 - NPC 1

from spade.agent import Agent
from spade.behaviour import CyclicBehaviour
from spade import quit_spade
from spade.message import Message
import time

welcomeMessage = "Pozdrav igraču! Vidim da si se usudio kročiti ovamo... kako ti mogu pomoći?"
incorrectMessage = "Pošalji Hi da bi popričao sa NPCjem 1."
gameResetMessage = "IGRA JE RESETIRANA\n\n"
availableQuestions = [
  {
    "trigger": "A",
    "question": "A: Gdje sam ja?",
    "answer": "Ušao si u svijet magičnih novčića!"
  },
  {
    "trigger": "B",
    "question": "B: Što moram učiniti da izađem?",
    "answer": "Moraš skupiti 10 novčića da bi uspio!"
  },
  {
    "trigger": "C",
    "question": "C: Kako najlakše zaraditi novce?",
    "answer": "Prošetaj malo, popričaj sa ljudima. Riješi njihove zadatke i nagraditi će te."
  },
  {
    "trigger": "D",
    "question": "D: Daj mi novčić!",
    "answer": "Novac je prolazan ali znanje je neprocjenjivo, rađe me pitaj nešto zanimljivije..."
  },
]

questionsString = ""

for question in availableQuestions: 
  questionsString += question.get("question") + "\n"


class Agent_NPC1(Agent):  
  class ReceiveAnswerMessages(CyclicBehaviour): 
    async def on_start(self):
      self.agent.sentPlayerData = False
      print("AGENT 2 - NPC1 initialized!\n\n")

    async def on_end(self):
      print("\nAGENT 2 - NPC1 decommissioned!\n\n")
      
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
        elif(msg.body == "RESET_GAME"):
          self.agent.sentPlayerData = False
          newMessage.body = gameResetMessage
          await self.send(newMessage)
        else: 
          for question in availableQuestions: 
            if(question.get("trigger") == msg.body):
              foundMatch = True
              newMessage.body = question.get("answer")    
              await self.send(newMessage)
              
              if(self.agent.sentPlayerData == False):
                agentMsg = Message()
                agentMsg.sender = "zzlen-agent-2@5222.de"
                agentMsg.to = "zzlen-agent-6@5222.de"
                agentMsg.body = "COMPLETE"
                await self.send(agentMsg)
              
        if(foundMatch == False):
          newMessage.body = incorrectMessage    
          await self.send(newMessage)
                
  async def setup(self):
    fsm = self.ReceiveAnswerMessages()
    self.add_behaviour(fsm)

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

if __name__ == "__main__":
  agent_NPC1 = Agent_NPC1('zzlen-agent-2@5222.de', '9"Xp^NCDcLzh>-j')
  agentInit = agent_NPC1.start()
  agentInit.result()
  agent_NPC1.web.start(hostname="127.0.0.1", port="12345")

  while agent_NPC1.is_alive():
    try:
      time.sleep(1)
    except KeyboardInterrupt:
      break

  agent_NPC1.stop()
  quit_spade()
        