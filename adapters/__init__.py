from adapters.adapter_base import BaseAdapter, AdapterResult
from adapters.openai_adapter import OpenAIAdapter
from adapters.crewai_adapter import CrewAIAdapter
from adapters.claude_code_adapter import ClaudeCodeAdapter
from adapters.lyzr_adapter import LyzrAdapter

ALL_ADAPTERS = {
    "openai": OpenAIAdapter(),
    "crewai": CrewAIAdapter(),
    "claude_code": ClaudeCodeAdapter(),
    "lyzr": LyzrAdapter()
}

__all__ = [
    "BaseAdapter",
    "AdapterResult",
    "OpenAIAdapter",
    "CrewAIAdapter",
    "ClaudeCodeAdapter",
    "LyzrAdapter",
    "ALL_ADAPTERS"
]
