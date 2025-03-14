const StaffMember = ({ member }) => (
  <View style={styles.staffMember}>
    <Image source={{ uri: member.image }} style={styles.staffImage} />
    <Text style={styles.staffName}>{member.name}</Text>
    <Text style={styles.staffRole}>{member.role}</Text>
  </View>
);

const styles = StyleSheet.create({
  staffMember: {
    alignItems: 'center',
    margin: 10
  },
  staffImage: {
    width: 100,
    height: 100,
    borderRadius: 50
  },
  staffName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8
  },
  staffRole: {
    fontSize: 14,
    color: '#666'
  }
});

export default StaffMember;