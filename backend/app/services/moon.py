import datetime

def get_moon_phase(date: datetime.date = None) -> dict:
    """
    Calculates approximate moon phase and gardening recommendations.
    """
    if date is None:
        date = datetime.date.today()

    # Synodic month length = 29.53058867 days
    # Reference new moon: Jan 11, 2024
    ref_date = datetime.date(2024, 1, 11)
    days_since_ref = (date - ref_date).days
    phase_num = (days_since_ref % 29.53058867) / 29.53058867

    if phase_num < 0.03 or phase_num > 0.97:
        phase_name = "Новолуние 🌑"
        recommendation = "Отдых почвы. Не рекомендуется производить посадку и обрезку."
    elif phase_num < 0.25:
        phase_name = "Растущая Луна 🌘"
        recommendation = "Благоприятное время для посева, пересадки и укоренения зеленых листовых культур."
    elif phase_num < 0.53:
        phase_name = "Полнолуние 🌕"
        recommendation = "Идеально для внесения жидких органических подкормок и рыхления почвы."
    else:
        phase_name = "Убывающая Луна 🌒"
        recommendation = "Благоприятный период для обрезки кроны, борьбы с вредителями и пикировки корнеплодов."

    return {
        "date": date.isoformat(),
        "phase_name": phase_name,
        "recommendation": recommendation
    }
