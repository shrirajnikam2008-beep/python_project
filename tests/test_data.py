"""
Tests verifying data integrity of the 5 canonical CSV files in data/.
"""
from scripts.validate_data import validate

def test_csv_validation():
    assert validate() is True
