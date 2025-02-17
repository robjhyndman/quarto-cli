---@meta

---@module 'pandoc.types'
pandoc.types = {}

--[[
Opaque type holding a compiled template.
]]
---@class pandoc.types.Template
pandoc.types.Template = {}

--[[
A pandoc log message. Objects have no fields, but can be converted to a string via `tostring`.
]]
---@class pandoc.types.LogMessage
pandoc.types.LogMessage = {}



--[[
A version object. This represents a software version like
"2.7.3". The object behaves like a numerically indexed table,
i.e., if `version` represents the version `2.7.3`, then

    version[1] == 2
    version[2] == 7
    version[3] == 3
    #version == 3   -- length

Comparisons are performed element-wise, i.e.

    Version '1.12' > Version '1.9'
]]
---@class pandoc.types.Version
pandoc.types.Version = {}

---@alias version_specifier string|integer|integer[]|pandoc.types.Version

---@param version_specifier version_specifier
---@return pandoc.types.Version
function pandoc.types.Version(version_specifier) end


--[[
Raise an error message if the version is older than the expected version; 
does nothing if actual is equal to or newer than the expected version.  
]]
---@param actual version_specifier # Actual version specifier
---@param expected version_specifier # Expected version specifier
---@param error_message? string # (Optional) Error message template. The string is used as format string, with the expected and actual versions as arguments. Defaults to `"expected version %s or newer, got %s"`.
function pandoc.types.Version.must_be_at_least(actual, expected, error_message) end



