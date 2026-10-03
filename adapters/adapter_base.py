"""
Base class and common types for AgentPort Framework Adapters.
"""
from typing import Dict, Any, List
from abc import ABC, abstractmethod

class AdapterResult:
    def __init__(
        self,
        framework: str,
        success: bool,
        artifact: str,
        portable_fields: List[str],
        framework_specific_fields: List[str],
        warnings: List[str],
        raw_manifest: Dict[str, Any] = None
    ):
        self.framework = framework
        self.success = success
        self.artifact = artifact
        self.portable_fields = portable_fields
        self.framework_specific_fields = framework_specific_fields
        self.warnings = warnings
        self.raw_manifest = raw_manifest or {}

    def to_dict(self) -> Dict[str, Any]:
        return {
            "framework": self.framework,
            "success": self.success,
            "artifact": self.artifact,
            "portable_fields": self.portable_fields,
            "framework_specific_fields": self.framework_specific_fields,
            "warnings": self.warnings
        }

class BaseAdapter(ABC):
    @property
    @abstractmethod
    def framework_name(self) -> str:
        pass

    @abstractmethod
    def transform(self, canonical_data: Dict[str, Any]) -> AdapterResult:
        pass
