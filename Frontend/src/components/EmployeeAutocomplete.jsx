import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiRequest } from "../services/api";

const EmployeeAutocomplete = ({
  value,
  selectedEmployee,
  onChange,
  onSelect,
  onClear,
}) => {
  const token = useSelector((state) => state.auth.token);

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const term = value.trim();

    const selectedLabel = selectedEmployee
      ? `${selectedEmployee.name} (${selectedEmployee.employeeCode})`
      : "";

    // Stop API call if empty or already selected
    if (!term || term === selectedLabel) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);

        const results = await apiRequest({
          path: `/api/employees/search?q=${encodeURIComponent(term)}`,
          token,
        });

        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300); // debounce

    return () => clearTimeout(timeoutId);
  }, [value, selectedEmployee, token]);

  return (
    <div className="position-relative">
      <div className="input-group input-group-sm">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name or code"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => {
            if (suggestions.length) setShowSuggestions(true);
          }}
          onBlur={() => {
            setTimeout(() => setShowSuggestions(false), 150);
          }}
        />

        {(value || selectedEmployee) && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => {
              onClear();
              setSuggestions([]);
              setShowSuggestions(false);
            }}
          >
            Clear
          </button>
        )}
      </div>

      {showSuggestions && (loading || suggestions.length > 0) && (
        <div
          className="position-absolute top-100 start-0 end-0 bg-white border rounded shadow-sm mt-1"
          style={{ zIndex: 20, maxHeight: "220px", overflowY: "auto" }}
        >
          {loading && (
            <div className="px-3 py-2 small text-muted">Searching...</div>
          )}

          {!loading &&
            suggestions.map((employee) => (
              <button
                key={employee._id}
                type="button"
                className="btn btn-link text-start text-decoration-none w-100 px-3 py-2 border-0"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onSelect(employee);
                  setSuggestions([]);
                  setShowSuggestions(false);
                }}
              >
                <div className="fw-semibold text-dark">
                  {employee.name}
                </div>
                <div className="small text-muted">
                  {employee.employeeCode}
                  {employee.department
                    ? ` | ${employee.department}`
                    : ""}
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeAutocomplete;