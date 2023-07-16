# AGENT 3 - NPC 2

import time
import spade
from spade.agent import Agent
from spade.behaviour import FSMBehaviour, State, PeriodicBehaviour, CyclicBehaviour
from spade import quit_spade
from spade.message import Message

welcomeMessage = "Nitko u ovome gradu ne može riješiti moju zagonetku!"
incorrectMessage = "Pošalji Hi da bi popričao sa NPCjem 3."
gameResetMessage = "IGRA JE RESETIRANA\n\n"
availableQuestions = [
  [
    {
      "trigger": "A",
      "question": "A: Baš si siguran u sebe?",
      "answer": "Probaj ako se usudiš! Štoviše, dajem ti 3 novčića ako pogodiš!"
      
    },
    {
      "trigger": "B",
      "question": "B: Reci mi svoju zagonetku.",
      "answer": "Odgonetni što sam - Sprijeda mu, straga bu.",
      "solution": "krava",
      "coins": 3,
      "nextState": True
    },
  ],
  [
    {
      "answer": "Ne vjerujem da je netko pogodio moju zagonetku...",
    },
  ]
]
questionsString = ""

for question in availableQuestions[0]: 
  questionsString += question.get("question") + "\n"


class Agent_NPC3(Agent):
  class FSMAgentBehaviour(FSMBehaviour): 
    async def on_start(self):
      self.agent.sentPlayerData = False
      print("AGENT 4 - NPC3 initialized!\n\n")

    async def on_end(self):
      print("\nAGENT 4 - NPC3 decommissioned!\n\n")
  
  class State1(State):
    async def run(self):
      msg = await self.receive(timeout=10)
      
      if(msg):
        print(f"Received message: {msg.body}")
        
        newMessage = msg.make_reply()
        foundMatch = False
        changeState = False
        
        if(msg.body == "Hi"):
          foundMatch = True
          newMessage.body = welcomeMessage + "\n\n" + questionsString
        else: 
          for question in availableQuestions[0]: 
            if(question.get("trigger") == msg.body):
              foundMatch = True
              newMessage.body = question.get("answer")    
            elif(msg.body == question.get("solution", "")):
              foundMatch = True
              changeState = True
              newMessage.body = availableQuestions[1][0].get("answer", "") + "  RECEIVED_COINS=" + str(question.get("coins", 0))
              
              if(self.agent.sentPlayerData == False):
                agentMsg = Message()
                agentMsg.sender = "zzlen-agent-2@5222.de"
                agentMsg.to = "zzlen-agent-6@5222.de"
                agentMsg.body = "COMPLETE"
                await self.send(agentMsg)
              
        if(foundMatch == False):
          newMessage.body = incorrectMessage    
      
        await self.send(newMessage)
        
        if(changeState == True):
          self.set_next_state("State2")
        else: 
          self.set_next_state("State1")
  
  class State2(State):
    async def run(self):
      msg = await self.receive(timeout=10)
      
      if(msg):
        print(f"Received message: {msg.body}")
        
        newMessage = msg.make_reply()
        
        if(msg.body == "RESET_GAME"):
          newMessage.body = gameResetMessage
          await self.send(newMessage)
          self.agent.sentPlayerData = False
          self.set_next_state("State1")
        else: 
          newMessage.body = availableQuestions[1][0].get("answer", "")
          await self.send(newMessage)

        self.set_next_state("State2")

  async def setup(self):   
    fsm = self.FSMAgentBehaviour()
    
    fsm.add_state(name="State1", state=self.State1(), initial=True)
    fsm.add_state(name="State2", state=self.State2())
    
    fsm.add_transition(source="State1", dest="State1")
    fsm.add_transition(source="State1", dest="State2")
    fsm.add_transition(source="State2", dest="State2")
    fsm.add_transition(source="State2", dest="State1")
    
    self.add_behaviour(fsm)
    
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

if __name__ == "__main__":
  agent_NPC3 = Agent_NPC3('zzlen-agent-4@5222.de', '9"Xp^NCDcLzh>-j')
  agentInit = agent_NPC3.start()
  agentInit.result()
  agent_NPC3.web.start(hostname="127.0.0.1", port="12347")

  while agent_NPC3.is_alive():
    try:
      time.sleep(1)
    except KeyboardInterrupt:
      break

  agent_NPC3.stop()
  quit_spade()
        